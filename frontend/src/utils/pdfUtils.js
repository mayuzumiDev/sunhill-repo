import { axiosInstance } from "./axiosInstance";

export const generatePdf = async (apiEndpoint, accountsData) => {
  try {
    if (!accountsData || !Array.isArray(accountsData)) {
      throw new Error("Invalid accounts data provided.");
    }

    const requestData = {
      accounts: accountsData.map((account) => ({
        username: account.username,
        password: account.password,
        parent_username: account?.parent_username,
        parent_password: account?.parent_password,
        role: account.role,
        branch_name: account.branch_name,
      })),
    };

    const response = await axiosInstance.post(apiEndpoint, requestData, {
      responseType: "blob",
    });

    // Get Current Date in YYYY-MM-DD format
    const currentDate = new Date().toISOString().slice(0, 10);

    // Create a URL for the blob response
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const a = document.createElement("a");
    a.href = url;

    // Modify the filename to include the date
    a.download = `Sunhill-LMS-Generated-Accounts-${currentDate}.pdf`;

    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  }
};
