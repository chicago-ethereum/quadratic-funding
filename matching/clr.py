from eth_utils import is_hex, to_hex

'''
    Helper function that enforces that funder addresses are in hex format.

    Args:
        [funders] (str)

    Returns:
        [funders] (str)
'''
def check_addresses(funders):
    result = []
    for f in funders:
        if not is_hex(f):
            to_hex(f)
        result.append(f)
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
        [recipients] (str)
        [funders] (str)
        [contributions] (int)

    Returns:
        [ ( recipient (str), funder (str), contribution (float) ) ]
'''
def process_raw_data(recipients, funders, contributions):
    hex_funders = check_addresses(funders)
    chiDAI_contribs = to_chiDAI(contributions)
    return list(zip(recipients, hex_funders, chiDAI_contribs))

'''
    Helper function that aggregates contributions from the same funder
    to a given recipient.

    Args:
        grants: [ ( recipient (str), funder (int), contribution (float) ) ]

    Returns:
        { 'recipient' (str): { 'funder' (int): agg_contribution (float) } }
'''
def aggregate(grants):
    aggregated = {}
    for recipient, funder, contribution in grants:
        if recipient not in aggregated:
            aggregated[recipient] = {}
        aggregated[recipient][funder] = aggregated[recipient].get(funder, 0) + contribution
    return aggregated

'''
    Helper function that sums individual contributions to each recipient.

    Args:
        grants: { 'recipient' (str): { 'funder' (int): contribution (float) } }

    Returns:
        { 'recipient' (str): sum_contribution (float) }

'''
def recipient_grant_sum(grants):
    return {key:sum(value.values()) for key, value in grants.items()}

'''
    Helper function that calculates the unconstrained liberal radical match
    for each recipient.

    Args:
        grants: { 'recipient' (str): { 'funder' (int): contribution (float) } }

    Returns:
        { 'recipient' (str): lr_grant (float) }

'''
def calc_lr_matches(grants):
    matches = {}
    for recipient in grants:
        sum_sqrts = sum([i**(1/2) for i in grants[recipient].values()])
        squared = sum_sqrts**2
        matches[recipient] = squared
    return matches

'''
    Helper function that normalizes the liberal radical grants to the
    total matching budget.

    Args:
        { 'recipient' (str): lr_grant (float) }
        budget (float)

    Returns:
        { 'recipient' (str): lr_grant (float) }
'''
def constrain_by_budget(matches, budget):
    raw_total = sum(matches.values())
    constrained = {key:value/raw_total * budget for key, value in matches.items()}
    return constrained

'''
    Helper function that calculates constrained liberal radical matches and
    helpful info.

    Args:
        [recipients] (ints)
        [funders] (ints)
        [contributions] (floats)
        budget: (float)

    Returns:
        grants: { 'recipient' (str): { 'funder' (int): agg_contribution (float) } }
        lr_matches:  { 'recipient' (str): lr_match (float) }
        clr: { 'recipient' (str): clr_match(float) }
'''
def clr(recipients, funders, contribution_amounts, budget):
    raw_grants = process_raw_data(recipients, funders, contribution_amounts)
    grants = aggregate(raw_grants)
    recipient_grant_sums = recipient_grant_sum(grants)
    lr_matches = calc_lr_matches(grants)
    clr = constrain_by_budget(lr_matches, budget)

    return grants, lr_matches, clr
