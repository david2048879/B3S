const roles = [
    { department: "Executive", role: "EXECUTIVE" },
    { department: "Branch Leadership", jobTitle: "Branch Manager", role: "SUPERVISOR" },
    { department: "Finance", jobTitle: "Data Analysis and Reporting Manager", role: "SUPERVISOR" },
    { department: "Human Resources", jobTitle: "Human Resources Associate Manager", role: "HrManager" },
    { department: "Human Resources", role: "HR" },
    { department: "Human Resources",jobTitle: "Human Resources Officer", role: "HR" },
    { department: "IT", jobTitle: "Director of IT and Product Development", role: "SYSTEMADMIN" }
];

const getRole = (staffRole) => {
    for (const { department, jobTitle, role } of roles) {
        if ((department === staffRole.department) && (!jobTitle || jobTitle === staffRole.jobTitle)) {
            return role;
        }
    }
    return "STAFF"; // Default role
};

export default getRole;
