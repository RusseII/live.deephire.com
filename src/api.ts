const apiUrl = 'https://a.deephire.com/v1';
// const apiUrl = 'http://localhost:3001/v1';


const headers = { "Content-Type": "application/json" }

export const getCompanyData = async (companyId: string | undefined) => {
    const companyData = await fetch(`${apiUrl}/companies/${companyId}`)
        .then((response: any) => {
            if (response.ok) return response.json();
        })

    return companyData
};


export const getCandidateData = async (candidateEmail: string | undefined) => {
    const candidateData = await fetch(`${apiUrl}/candidates/${candidateEmail}`)
        .then((response: any) => {
            if (response.ok) return response.json();
        })

    return candidateData
}

export const getLiveData = async (URLRoomName: string | undefined) => {
    const liveData = await fetch(`${apiUrl}/live/${URLRoomName}`)
        .then((response: any) => {
            if (response.ok) return response.json();
        })

    return liveData
}


export const putDeviceInfo = async (URLRoomName: string | undefined, data: {}) => {

    const body = { deviceInfo: data }
    const putDeviceData = await fetch(`${apiUrl}/live/${URLRoomName}`, { method: "PUT", headers, body: JSON.stringify(body) })
        .then((response: any) => {
            if (response.ok) return true
        })

    return putDeviceData
}