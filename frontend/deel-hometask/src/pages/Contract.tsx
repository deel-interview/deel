import { useEffect, useState } from "react";
import {
  getContractDetails,
  getProfileDetails,
  getUser,
  payforJob,
} from "../services";
import { ContractTypes, User } from "../types";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../components/ui/button";
import { formatCurrency } from "../lib/utils";
import { ChevronLeft, Loader2 } from "lucide-react";
import { toast, Toaster } from "sonner";

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
  const [payLoading, setPayLoading] = useState<null | number>(null);

  const navigate = useNavigate();

  const getUserProfile = async (id: string) => {
    console.log(id);
    try {
      const res = await getProfileDetails(id);
      setCurrentUser(res);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const user = getUser();
    if (user) {
      getUserProfile(user);
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

        setContractData(res);
      } catch (error) {}
    };

    getContracts();
  }, [id, currentUser.id]);

  const payHandler = async (id: number) => {
    setPayLoading(id);
    try {
      const res = await payforJob({ id: id, userId: currentUser.id! });
      console.log(res);
      navigate(0);
      // window.location.reload();
    } catch (error) {
      //@ts-ignore
      toast.error(error?.message);
    } finally {
      setPayLoading(null);
    }
  };

  return (
    <>
      <Toaster position="top-right" richColors />
      <div className="border rounded-lg p-8 mt-[3rem] max-w-[80rem] w-11/12 mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold uppercase">
            Welcome, {currentUser.firstName} {currentUser.lastName}
          </h2>
          <div className="flex items-center gap-3">
            <span className="py-1 px-5 bg-black/30 text-white uppercase rounded-md font-bold">
              {currentUser.type}
            </span>
            <Button size="sm" className="py-0" onClick={() => navigate(-1)}>
              <ChevronLeft />
              Go back
            </Button>
          </div>
        </div>
        <div className="space-y-2">
          {currentUser?.type !== "client" && (
            <h3 className="grid grid-cols-[10rem,1fr]">
              <span className="font-bold">Client : </span>
              <span>
                {contractData?.Client.firstName} {contractData?.Client.lastName}
              </span>
            </h3>
          )}
          {currentUser?.type === "client" && (
            <h3 className="grid grid-cols-[10rem,1fr]">
              <span className="font-bold">Contractor : </span>
              <span>
                {contractData?.Contractor.firstName}{" "}
                {contractData?.Contractor.lastName}
              </span>
            </h3>
          )}
          <h3 className="grid grid-cols-[10rem,1fr]">
            <span className="font-bold">Terms : </span>
            <span>{contractData?.terms}</span>
          </h3>
          <h3 className="grid grid-cols-[10rem,1fr]">
            <span className="font-bold">Status : </span>
            <span>{contractData?.status}</span>
          </h3>
          <h3 className="grid grid-cols-[10rem,1fr]">
            <span className="font-bold">Date : </span>
            <span>{contractData?.createdAt.split("T")[0]}</span>
          </h3>
        </div>
        <div className="mt-12">
          <h4 className="font-bold text-2xl">Jobs</h4>
          <div className="max-h-[60dvh] overflow-auto">
            {contractData && contractData?.Jobs.length > 0 ? (
              <div className="mt-6">
                <h2 className="text-xl font-bold">Your contracts</h2>

                <table className="w-full mt-4">
                  <thead className="bg-slate-300">
                    <tr>
                      <th className="p-2">Date</th>

                      <th className="p-2">Description</th>
                      <th className="p-2">Price</th>
                      <th className="p-2">Paid</th>
                      <th className="p-2">Payment Date</th>

                      {currentUser?.type === "client" && (
                        <th className="p-2"></th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {contractData?.Jobs?.map((job) => (
                      <tr className="border-b text-center p-4" key={job.id}>
                        <td className="p-2">{job.createdAt.split("T")[0]}</td>

                        <td>{job.description}</td>
                        <td>{formatCurrency(job.price)}</td>
                        <td>{job.paid ? "True" : "False"}</td>
                        <td>{job.paymentDate?.split("T")[0] ?? "N/A"}</td>
                        {currentUser?.type === "client" && (
                          <td className="p-4">
                            <Button
                              disabled={job.paid ? true : false}
                              onClick={() => payHandler(job.id)}
                            >
                              {job.paid ? (
                                "Paid"
                              ) : payLoading === job.id ? (
                                <Loader2 className="animate-spin" />
                              ) : (
                                "Pay"
                              )}
                            </Button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="mt-8">
                <h2 className="text-neutral-600 italic">
                  You have no active contracts
                </h2>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Contract;
