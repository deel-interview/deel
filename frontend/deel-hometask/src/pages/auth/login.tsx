import { useEffect, useState } from "react";
import { getProfile } from "../../services";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Button } from "../../components/ui/button";
import { toast, Toaster } from "sonner";
import { useNavigate } from "react-router-dom";
import { User } from "../../types";

const LoginPage = () => {
  const [allUser, setAllUser] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const userData = async () => {
      const res = await getProfile();
      if (res) {
        setAllUser(res);
      }
    };
    userData();
  }, []);

  const loginHandler = () => {
    const loggedUser = selectedUser;
    if (!loggedUser) {
      toast.error("Select a user");
      return;
    }
    localStorage.setItem("deel-user", loggedUser);
    navigate("/");
  };

  const selectChangeHandler = (val: any) => {
    setSelectedUser(val);
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="min-h-screen flex  justify-center mt-[5rem]">
        <section className="border rounded-lg p-8 max-w-[25rem] w-11/12 flex flex-col gap-5 items-center shadow-md h-fit">
          <h2 className="text-2xl font-bold">Select A User To Test With</h2>
          <Select onValueChange={selectChangeHandler}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select a user" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {allUser.map((user) => (
                  <SelectItem key={user.id} value={user.id?.toString()!}>
                    {user.firstName} {user.lastName}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button onClick={loginHandler}>Log in </Button>
        </section>
      </div>
    </>
  );
};

export default LoginPage;
