const BASE_URL = "http://localhost:3001";

export const getProfile = async () => {
  const res = await fetch(`${BASE_URL}/users/profiles`, {
    method: "GET",
    cache: "no-store",
    headers: {
      profile_id: "1",
    },
  });
  if (!res.ok) {
    throw new Error("Failed to get profile");
  }
  const data = await res.json();

  return data;
};

export const getProfileDetails = async (id: string) => {
  const res = await fetch(`${BASE_URL}/users/profile`, {
    method: "GET",
    cache: "no-store",
    headers: {
      profile_id: id,
    },
  });
  // console.log(res);
  if (!res.ok) {
    throw new Error("Failed to get profile details");
  }
  const data = await res.json();

  return data;
};

export const getUser = () => {
  const isUser = localStorage.getItem("deel-user");
  return isUser && isUser;
};

export const getContracts = async (id: number) => {
  const res = await fetch(`${BASE_URL}/contracts`, {
    method: "GET",
    cache: "no-store",
    headers: {
      profile_id: id.toString(),
    },
  });

  if (!res.ok) {
    throw new Error("Failed to get contract");
  }

  const data = await res.json();

  return data;
};

export const getContractDetails = async ({
  userId,
  contractId,
}: {
  userId: number;
  contractId: string;
}) => {
  const res = await fetch(`${BASE_URL}/contracts/${contractId}`, {
    method: "GET",
    cache: "no-store",
    headers: {
      profile_id: userId.toString(),
    },
  });
  if (!res.ok) {
    throw new Error("Failed to get contract");
  }
  const data = await res.json();

  return data;
};

export const payforJob = async ({
  id,
  userId,
}: {
  id: number;
  userId: number;
}) => {
  console.log(userId);
  const res = await fetch(`${BASE_URL}/jobs/${id}/pay`, {
    method: "POST",
    cache: "no-store",
    headers: {
      profile_id: userId.toString(),
    },
    body: "Test body",
  });

  if (!res.ok) {
    throw new Error("Failed to pay");
  }
  const data = await res.json();

  return data;
};
