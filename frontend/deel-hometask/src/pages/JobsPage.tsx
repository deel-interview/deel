import { useEffect, useState } from "react";
import { getProfileDetails, getUser, getUserUnpaidJobs } from "../services";
import { toast } from "sonner";
import { User } from "../types";
import { Button } from "../components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "../lib/utils";

const JobsPage = () => {
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
  const [unpaidJobs, setUnpaidJobs] = useState<{ [key: string]: any }[]>([]);
  const navigate = useNavigate();

  const unpaidJobsHandler = async (id: string) => {
    try {
      const res = await getUserUnpaidJobs(id);
      setUnpaidJobs(res);
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
      unpaidJobsHandler(user);
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
      {unpaidJobs?.length > 0 ? (
        <div className="mt-12">
          <h2 className="text-xl font-bold">Unpaid Jobs</h2>
          <table className="w-full mt-4">
            <thead className="bg-slate-300">
              <tr>
                <th className="p-2">Date</th>

                <th className="p-2">Description</th>
                <th className="p-2">Status</th>
                <th className="p-2">Price</th>
                <th className="p-2">Paid</th>
                <th className="p-2">Payment Date</th>

                <th className="p-2"></th>
              </tr>
            </thead>
            <tbody>
              {unpaidJobs?.map((job) => (
                <tr className="border-b text-center p-4" key={job.id}>
                  <td className="p-2">{job.createdAt.split("T")[0]}</td>

                  <td>{job.description}</td>
                  <td>{job.Contract.status}</td>
                  <td>{formatCurrency(job.price)}</td>
                  <td>{job.paid ? "Paid" : "Unpaid"}</td>
                  <td>{job.paymentDate?.split("T")[0] ?? "N/A"}</td>

                  <td className="p-4"></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mt-8">
          <h2 className="text-neutral-600 italic">No Unpaid Jobs</h2>
        </div>
      )}
    </div>
  );
};

export default JobsPage;
