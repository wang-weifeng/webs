import request from '@/utils/request';

export async function deviceList(params: any) {
    return request('/api/device/list', {
        method: 'POST',
        data: params,
    });
}

export async function deviceUpdate(params: any) {
    return request('/api/device/update', {
        method: 'POST',
        data: params,
    });
}

export async function deviceAdd(params: any) {
    return request('/api/device/add', {
        method: 'POST',
        data: params,
    });
}

export async function deviceDel(params: any) {
    return request('/api/device/del', {
        method: 'POST',
        data: params,
    });
}

