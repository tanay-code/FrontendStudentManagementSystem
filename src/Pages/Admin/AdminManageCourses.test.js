// import React from "react";
// import { render, screen, fireEvent, waitFor } from "@testing-library/react";
// import axios from "axios";
// import AdminManageCourses from "./AdminManageCourses";
// import AppContext from "../../context/AppContext";

// jest.mock("axios");

// describe("AdminManageCourses Basic Tests", () => {
//   const mockUser = { token: "testToken" };
//   const mockCoursesData = [
//     {
//       id: 1,
//       courseName: "Course 1",
//       description: "Desc 1",
//       duration: "10 weeks",
//     },
//   ];

//   const renderComponent = (props = {}) => {
//     return render(
//       <AppContext.Provider value={{ user: mockUser }}>
//         <AdminManageCourses {...props} />
//       </AppContext.Provider>
//     );
//   };

//   beforeEach(() => {
//     axios.get.mockResolvedValue({ data: mockCoursesData });
//   });

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   it("renders the component and fetches courses", async () => {
//     renderComponent();
//     await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
//     expect(screen.getByText("Course 1")).toBeInTheDocument();
//   });

//   it("opens delete confirmation modal", async () => {
//     renderComponent();
//     await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
//     const deleteButton = screen.getByText("Delete");
//     fireEvent.click(deleteButton);
//     expect(screen.getByText("Confirm Delete")).toBeInTheDocument();
//   });

//   it("opens edit course modal", async () => {
//     renderComponent();
//     await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
//     const editButton = screen.getByText("Edit");
//     fireEvent.click(editButton);
//     expect(screen.getByText("Edit Course")).toBeInTheDocument();
//   });

//   it("renders admin header by default", () => {
//     renderComponent();
//     expect(screen.getByText("Admin Header")).toBeInTheDocument();
//   });
// });

// MinimalTest.test.jsx
import React from "react";
import { render } from "@testing-library/react";

describe("Minimal JSX Test", () => {
  it("should render a simple JSX element", () => {
    const { getByText } = render(<div>Hello, JSX!</div>);
    expect(getByText("Hello, JSX!")).toBeInTheDocument();
  });
});
