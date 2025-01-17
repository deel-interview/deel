const BASE_URL = "http://localhost:3001";

export const getProfile = async () => {
  const res = await fetch(`${BASE_URL}/users/profiles`, {
    method: "GET",
    cache: "no-store",
    headers: {
      profile_id: "1",
    },
  });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message);
  }

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

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message);
  }

  return data;
};

export const getUser = () => {
  const isUser = localStorage.getItem("deel-user");
  return isUser && isUser;
};

export const getContracts = async (id: string) => {
  const res = await fetch(`${BASE_URL}/contracts`, {
    method: "GET",
    cache: "no-store",
    headers: {
      profile_id: id,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message);
  }

  return data;
};

export const getContractDetails = async ({
  userId,
  contractId,
}: {
  userId: string;
  contractId: string;
}) => {
  const res = await fetch(`${BASE_URL}/contracts/${contractId}`, {
    method: "GET",
    cache: "no-store",
    headers: {
      profile_id: userId,
    },
  });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message);
  }

  return data;
};

export const payforJob = async ({
  id,
  userId,
}: {
  id: number;
  userId: string;
}) => {
  const res = await fetch(`${BASE_URL}/jobs/${id}/pay`, {
    method: "POST",
    cache: "no-store",
    headers: {
      profile_id: userId,
    },
    body: "Test body",
  });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message);
  }

  return data;
};

export const addBalance = async ({
  amount,
  userId,
}: {
  amount: string;
  userId: string;
}) => {
  const res = await fetch(`${BASE_URL}/users/deposit/${userId}`, {
    method: "POST",
    headers: {
      profile_id: userId,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ amount }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message);
  }

  return data;
};

export const getUserUnpaidJobs = async (id: string) => {
  const res = await fetch(`${BASE_URL}/jobs/unpaid`, {
    method: "GET",
    cache: "no-store",
    headers: {
      profile_id: id,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message);
  }

  return data;
};
