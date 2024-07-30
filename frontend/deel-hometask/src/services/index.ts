const BASE_URL = "http://localhost:3001";

export const getProfile = async () => {
  const profile = await fetch(`${BASE_URL}/users/profiles`, {
    method: "GET",
    headers: {
      profile_id: "1",
    },
  });

  const data = await profile.json();

  return data;
};

export const getUser = () => {
  const isUser = localStorage.getItem("deel-user");
  return isUser && JSON.parse(isUser);
};

export const getContracts = async (id: number) => {
  const contract = await fetch(`${BASE_URL}/contracts`, {
    method: "GET",
    headers: {
      profile_id: id.toString(),
    },
  });

  const data = await contract.json();

  return data;
};

export const getContractDetails = async ({
  userId,
  contractId,
}: {
  userId: number;
  contractId: string;
}) => {
  const contract = await fetch(`${BASE_URL}/contracts/${contractId}`, {
    method: "GET",
    headers: {
      profile_id: userId.toString(),
    },
  });

  const data = await contract.json();

  return data;
};
