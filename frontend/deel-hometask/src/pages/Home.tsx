import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { addBalance, getProfileDetails, getUser } from "../services";
import { User } from "../types";
import { toast, Toaster } from "sonner";
import { Link, useNavigate } from "react-router-dom";

import { CirclePlus } from "lucide-react";
import { formatCurrency } from "../lib/utils";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";

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
  const [showModal, setShowModal] = useState(false);
  const [amount, setAmount] = useState<string>();

  const navigate = useNavigate();

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
      getUserProfile(user);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("deel-user");
    navigate("/login");
  };

  const addBalanceHandler = async () => {
    if (!amount) {
      return;
    }
    try {
      const res = await addBalance({ amount, userId: currentUser.id! });
    } catch (error) {
      //@ts-ignore
      toast.error(error.message);
    }
  };

  return (
    <>
      <Toaster position="top-right" richColors />
      <div className="border rounded-lg p-8 mt-[3rem] max-w-[50rem] w-11/12 mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold uppercase">
            Welcome, {currentUser.firstName} {currentUser.lastName}
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
                <Button
                  className="py-0 px-3 h-7"
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowModal(true)}
                >
                  <CirclePlus />
                </Button>
              )}
            </div>
          </h3>

          <Button className="mt-8" asChild>
            <Link to="/contracts">View Contracts</Link>
          </Button>
        </div>
      </div>

      {/* HDR: MODAL */}
      <Dialog onOpenChange={() => setShowModal(false)} open={showModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add to your Balance</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="amount" className="text-right">
                Amount
              </label>
              <Input
                id="amount"
                type="number"
                className="col-span-3"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button">Add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Home;
