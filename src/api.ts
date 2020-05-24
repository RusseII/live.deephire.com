const apiUrl = 'https://a.deephire.com/v1';
// const apiUrl = 'http://localhost:3001/v1';


export const getCompanyData = async (URLRoomName: string | undefined) => {

    const liveData = await fetch(`${apiUrl}/live/${URLRoomName}`)
        .then((response: any) => {
            if (response.ok) return response.json();
        })

    const { companyId } = liveData
    const companyData = await fetch(`${apiUrl}/companies/${companyId}`)
        .then((response: any) => {
            if (response.ok) return response.json();
        })

    return companyData
};


export const getDocuments = async (URLRoomName: string | undefined) => {
    const liveData = await fetch(`${apiUrl}/live/${URLRoomName}`)
        .then((response: any) => {
            if (response.ok) return response.json();
        })

    const { candidateEmail, interviewType } = liveData
    // if (interviewType === "client") {
        // will add logic here for client only view
    // }

        const candidateData = await fetch(`${apiUrl}/candidates/${candidateEmail}`)
            .then((response: any) => {
                if (response.ok) return response.json();
            })
        return candidateData
}