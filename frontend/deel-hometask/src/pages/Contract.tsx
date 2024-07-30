import { useEffect, useState } from "react";
import { getContractDetails, getUser } from "../services";
import { ContractTypes, User } from "../types";
import { useParams } from "react-router-dom";

const Contract = () => {
  const [currentUser, setCurrentUser] = useState<User>({
    id: null,
    firstName: "",
    lastName: "",
    profession: "",
    balance: null,
    type: "",
    createdAt: "",
    updatedAt: "",
  });

  const [contractData, setContractData] = useState<ContractTypes>();

  useEffect(() => {
    const user = getUser();
    if (user?.id) {
      setCurrentUser(user);
    }
  }, []);

  const { id } = useParams();

  useEffect(() => {
    const getContracts = async () => {
      try {
        const res = await getContractDetails({
          userId: currentUser.id!,
          contractId: id!,
        });
        console.log(res);
        setContractData(res);
      } catch (error) {}
    };

    getContracts();
  }, [id, currentUser.id]);

  return (
    <div className="border rounded-lg p-8 mt-[3rem] max-w-[45rem] w-11/12 mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-base font-bold uppercase">Contract</h2>
        <span className="py-1 px-5 bg-black/50 text-white uppercase rounded-md font-bold">
          {currentUser.type}
        </span>
      </div>
      <div className="space-y-2">
        <h3 className="grid grid-cols-[10rem,1fr]">
          <span>Contractor ID : </span>
          <span>{contractData?.ContractorId}</span>
        </h3>
        <h3 className="grid grid-cols-[10rem,1fr]">
          <span>Terms : </span>
          <span>{contractData?.terms}</span>
        </h3>
        <h3 className="grid grid-cols-[10rem,1fr]">
          <span>Status : </span>
          <span>{contractData?.status}</span>
        </h3>
        <h3 className="grid grid-cols-[10rem,1fr]">
          <span>Date : </span>
          <span>{contractData?.createdAt.split("T")[0]}</span>
        </h3>
      </div>
      <div className="mt-12">
        <h4 className="font-bold text-2xl">Jobs</h4>
        <div>table</div>
      </div>
    </div>
  );
};

export default Contract;
