import REQ from '../../api/services'

export function getMonitorRuleAll() {
    return REQ.get('/rules/allMonitorRule');
}

export function getMonitorRuleByUser() {
    return REQ.get('/rules/userMonitorRule');
}

export function addRule(dto) {
    return REQ.post('/rules/monitorRule', dto);
}

export function updateRule(rid, state) {
    return REQ.put('/rules/monitorRule/' + rid + "/" + state);
}

export function deleteRule(id) {
    return REQ.delete('/rules/monitorRule/' + id);
}