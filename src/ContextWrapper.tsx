import React, { createContext, useState, useEffect } from 'react';
import { getLiveData, getCompanyData, getCandidateData } from './api';
import { useParams } from 'react-router-dom';
import { MessagesProps } from './components/Chat/Chat';

interface CandidateData {
  files: File[];
  email: string;
}

interface File {
  name: string;
  uid: string;
}

interface ContextWrapperProps {
  children: any;
}

interface ContextInterface {
  companyData: { companyName: string; logo: string } | null;
  candidateData: CandidateData | null;
  liveData: { jobName: string; candidateName: string; clientName: string | null; recruiterName: string } | null;
  userName: string;
  setUserName: any;
  messages: MessagesProps[];
  setMessages?: React.Dispatch<React.SetStateAction<MessagesProps[]>>;
}

const startingContext = {
  companyData: null,
  candidateData: null,
  liveData: null,
  userName: '',
  setUserName: null,
  messages: [],
  // setMessages: null
};

export const GlobalContext = createContext<ContextInterface>(startingContext);

export const ContextWrapper = (props: ContextWrapperProps) => {
  const [companyData, setCompanyData] = useState(null);
  const [liveData, setLiveData] = useState(null);
  const [candidateData, setCandidateData] = useState(null);
  const [userName, setUserName] = useState<string>('');
  const [messages, setMessages] = useState<MessagesProps[]>([]);
  // console.log("messages", messages)
  const { URLRoomName } = useParams();

  useEffect(() => {
    const setStartingData = async () => {
      const live = await getLiveData(URLRoomName);
      setLiveData(live);
      const { candidateEmail, companyId } = live;
      const company = await getCompanyData(companyId);
      setCompanyData(company);
      const candidate = await getCandidateData(candidateEmail);
      setCandidateData(candidate);
    };
    if (URLRoomName) setStartingData();
  }, [URLRoomName]);

  const getContext = (): ContextInterface => {
    return { companyData, liveData, candidateData, userName, setUserName, messages, setMessages };
  };
  return <GlobalContext.Provider value={getContext()}>{props.children}</GlobalContext.Provider>;
};
