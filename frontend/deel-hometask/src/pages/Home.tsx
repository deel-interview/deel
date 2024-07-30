import { useEffect, useState } from "react";
import { Button, buttonVariants } from "../components/ui/button";
import { getContracts, getUser } from "../services";
import { ContractTypes, User } from "../types";
import { toast, Toaster } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import { CirclePlus } from "lucide-react";
import { formatCurrency } from "../lib/utils";

const Home = () => {
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
  const [showContracts, setShowContracts] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const user = getUser();
    if (user?.id) {
      setCurrentUser(user);
    }
  }, []);

  const contractHandler = async () => {
    try {
      const res = await getContracts(currentUser.id!);
      setContracts(res);
      setShowContracts(true);
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("deel-user");
    navigate("/login");
  };

  return (
    <>
      <Toaster position="top-right" richColors />
      <div className="border rounded-lg p-8 mt-[3rem] max-w-[80rem] w-11/12 mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold uppercase">
            Welcome, {currentUser.firstName}
          </h2>
          <div className="flex items-center gap-2">
            <span className="py-1 px-5 bg-black/30 text-white uppercase rounded-md font-bold">
              {currentUser.type}
            </span>
            <Button size="sm" className="py-0" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
        <div className="w-full">
          <h3 className="grid grid-cols-[8rem,1fr] gap-3">
            <span className="font-semibold">Full Name :</span>{" "}
            <span className="capitalize text-xl">
              {currentUser.firstName} {currentUser.lastName}
            </span>
          </h3>
          <h3 className="grid grid-cols-[8rem,1fr] gap-3">
            <span className="font-semibold">Balance :</span>{" "}
            <div className="capitalize flex items-center gap-8">
              <span className="text-xl">
                {formatCurrency(currentUser.balance!)}
              </span>{" "}
              {currentUser?.type?.toLowerCase() === "client" && (
                <Button className="py-0 px-3 h-7" size="sm" variant="ghost">
                  <CirclePlus />
                </Button>
              )}
            </div>
          </h3>

          {!showContracts && (
            <Button className="mt-8" onClick={contractHandler}>
              View Contracts
            </Button>
          )}
        </div>

        {showContracts &&
          (contracts?.length > 0 ? (
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
                      <td className="p-2">
                        {contract.createdAt.split("T")[0]}
                      </td>

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
          ))}
      </div>
    </>
  );
};

export default Home;
