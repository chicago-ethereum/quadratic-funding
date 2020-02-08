from eth_utils import is_hex, to_hex

## TODO implement direct read from contract, using...
##  - infura api
##  - web3.py

'''
    Helper function that enforces that backer addresses are in hex format.

    Args:
        [backers] (str)

    Returns:
        [backers] (str)
'''
def check_addresses(backers):
    result = []
    for backer in backers:
        if not is_hex(backer):
            to_hex(backer)
        result.append(backer)
    return result

'''
    Helper function that converts raw erc20 contributions to floats

    Args:
        [contributions] (int)

    Returns:
        [contributions] (float)
'''
def to_chiDAI(contributions):
    chiDAI_contribs = [i / 10**18 for i in contributions]
    return chiDAI_contribs

'''
    Helper function that merges raw lists of grant information into a list
    of tuples.

    Args:
        [projects] (str)
        [backers] (str)
        [contributions] (int)

    Returns:
        [ ( project (str), backer (str), contribution (float) ) ]
'''
def process_raw_data(projects, backers, contributions):
    hex_backers = check_addresses(backers)
    chiDAI_contribs = to_chiDAI(contributions)
    return list(zip(projects, hex_backers, chiDAI_contribs))

'''
    Helper function that aggregates contributions from the same backer
    to a given project.

    Args:
        grants: [ ( project (str), backer (int), contribution (float) ) ]

    Returns:
        { 'project' (str): { 'backer' (int): agg_contribution (float) } }
'''
def aggregate(grants):
    aggregated = {}
    for project, backer, contribution in grants:
        if project not in aggregated:
            aggregated[project] = {}
        aggregated[project][backer] = aggregated[project].get(backer, 0) + contribution
    return aggregated

'''
    Helper function that sums individual contributions to each project.

    Args:
        grants: { 'project' (str): { 'backer' (int): contribution (float) } }

    Returns:
        { 'project' (str): sum_contribution (float) }

'''
def project_grant_sum(grants):
    return {key:sum(value.values()) for key, value in grants.items()}

'''
    Helper function that calculates the unconstrained liberal radical match
    for each project.

    Args:
        grants: { 'project' (str): { 'backer' (int): contribution (float) } }

    Returns:
        { 'project' (str): lr_grant (float) }

'''
def calc_lr_matches(grants):
    matches = {}
    for project in grants:
        sum_sqrts = sum([i**(1/2) for i in grants[project].values()])
        squared = sum_sqrts**2
        matches[project] = squared
    return matches

'''
    Helper function that normalizes the liberal radical grants to the
    total matching budget.

    Args:
        { 'project' (str): lr_grant (float) }
        budget (float)

    Returns:
        { 'project' (str): lr_grant (float) }
'''
def constrain_by_budget(matches, budget):
    raw_total = sum(matches.values())
    constrained = {key:value/raw_total * budget for key, value in matches.items()}
    return constrained

'''
    Helper function that calculates constrained liberal radical matches and
    helpful info.

    Args:
        [projects] (ints)
        [backers] (ints)
        [contributions] (floats)
        budget: (float)

    Returns:
        grants: { 'project' (str): { 'backer' (int): agg_contribution (float) } }
        lr_matches:  { 'project' (str): lr_match (float) }
        clr: { 'project' (str): clr_match(float) }
'''
def clr(projects, backers, contribution_amounts, budget):
    raw_grants = process_raw_data(projects, backers, contribution_amounts)
    grants = aggregate(raw_grants)
    project_grant_sums = project_grant_sum(grants)
    lr_matches = calc_lr_matches(grants)
    clr = constrain_by_budget(lr_matches, budget)

    return grants, lr_matches, clr
