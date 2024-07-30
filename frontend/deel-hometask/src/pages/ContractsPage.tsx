import { useEffect, useState } from "react";
import { ContractTypes, User } from "../types";
import { getContracts, getProfileDetails, getUser } from "../services";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import { Button, buttonVariants } from "../components/ui/button";
import { ChevronLeft } from "lucide-react";

const ContractsPage = () => {
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

  const [contracts, setContracts] = useState<ContractTypes[]>([]);
  const navigate = useNavigate();
  const contractHandler = async (id: string) => {
    try {
      const res = await getContracts(id);
      setContracts(res);
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const getUserProfile = async (id: string) => {
    try {
      const res = await getProfileDetails(id);
      setCurrentUser(res);
    } catch (error) {
      //@ts-ignore
      toast.error(error.message);
    }
  };
  useEffect(() => {
    const user = getUser();
    if (user) {
      contractHandler(user);
      getUserProfile(user);
    }
  }, []);

  return (
    <div className="border rounded-lg p-8 mt-[3rem] max-w-[80rem] w-11/12 mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold uppercase">
          Welcome, {currentUser.firstName} {currentUser.lastName}
        </h2>
        <div className="flex items-center gap-2">
          <span className="py-1 px-5 bg-black/30 text-white uppercase rounded-md font-bold">
            {currentUser.type}
          </span>
          <Button size="sm" className="py-0" onClick={() => navigate(-1)}>
            <ChevronLeft />
            Go back
          </Button>
        </div>
      </div>
      {contracts?.length > 0 ? (
        <div className="mt-12">
          <h2 className="text-xl font-bold">Your contracts</h2>
          <table className="w-full mt-4">
            <thead className="bg-slate-300">
              <tr>
                <th className="p-2">Date</th>

                <th className="p-2">Status</th>
                <th className="p-2">Term</th>
                <th className="p-2">Contractor</th>
                {currentUser.type.toLowerCase() !== "client" && (
                  <th className="p-2">Client</th>
                )}
                <th className="p-2"></th>
              </tr>
            </thead>
            <tbody>
              {contracts?.map((contract) => (
                <tr className="border-b text-center p-4" key={contract.id}>
                  <td className="p-2">{contract.createdAt.split("T")[0]}</td>

                  <td>{contract.status}</td>
                  <td>{contract.terms}</td>
                  <td>
                    {contract.Contractor.firstName}{" "}
                    {contract.Contractor.lastName}
                  </td>
                  {currentUser.type.toLowerCase() !== "client" && (
                    <td className="p-2">
                      {contract.Client.firstName} {contract.Client.lastName}
                    </td>
                  )}
                  <td className="p-4">
                    <Link
                      to={`/contracts/${contract.id}`}
                      className={twMerge(
                        buttonVariants({ variant: "default" }),
                        "h-8"
                      )}
                    >
                      View Contract
                    </Link>
                  </td>
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
  );
};

export default ContractsPage;
