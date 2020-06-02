
import React, { createContext, useState, useEffect } from 'react';
import { getLiveData, getCompanyData, getCandidateData } from './api'
import { useParams } from 'react-router-dom';

interface CandidateData {
    files: File[]
    email: string
}

interface File {
    name: string, uid: string
}


interface ContextWrapperProps {
    children: any
}

interface ContextInterface {
    companyData: { companyName: string, logo: string } | null,
    candidateData: CandidateData | null,
    liveData: { jobName: string, candidateName: string } | null,
    userName: string | null,
    setUserName: any
}

const startingContext = {
    companyData: null,
    candidateData: null,
    liveData: null,
    userName: null,
    setUserName: null
}

export const GlobalContext = createContext<ContextInterface>(startingContext)

export const ContextWrapper = (props: ContextWrapperProps) => {
    const [companyData, setCompanyData] = useState(null)
    const [liveData, setLiveData] = useState(null)
    const [candidateData, setCandidateData] = useState(null)
    const [userName, setUserName] = useState(null)

    const { URLRoomName } = useParams();
    
    useEffect(() => {
        const setStartingData = async () => {
            const live = await getLiveData(URLRoomName)
            setLiveData(live)
            const { candidateEmail, companyId } = live
            const company = await getCompanyData(companyId)
            setCompanyData(company)
            const candidate = await getCandidateData(candidateEmail)
            setCandidateData(candidate)
        }
        if (URLRoomName) setStartingData()
    }, [URLRoomName])

    const getContext = (): ContextInterface => {
        return { companyData, liveData, candidateData, userName, setUserName }
    }
    return (
        <GlobalContext.Provider value={getContext()}>
            {props.children}
        </GlobalContext.Provider>
    )

}

