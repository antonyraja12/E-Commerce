import { rest } from "msw";
import { rootUrl } from "../helpers/url";
export const handlers = [
  rest.get(`${rootUrl}/user`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          userId: 2,
          userName: "Administrator",
          email: null,
          contactNumber: null,
          roleId: 2,
          role: {
            roleId: 2,
            roleName: "Super User",
            active: true,
            createdOn: null,
            updatedOn: "2023-06-27T05:00:04.641023Z",
          },
          password: "123456",
          active: true,
          createdOn: null,
          updatedOn: "2023-06-02T05:01:27.237807Z",
          ahid: null,
        },
        {
          userId: 3,
          userName: "Madhu",
          email: "madhu@maxbytetech.com",
          contactNumber: "9876543210",
          roleId: 3,
          role: {
            roleId: 3,
            roleName: "Manager",
            active: true,
            createdOn: null,
            updatedOn: "2023-06-27T05:00:04.641023Z",
          },
          password: "123456",
          active: true,
          createdOn: null,
          updatedOn: "2023-06-02T11:33:24.159653Z",
          ahid: null,
        },
        {
          userId: 52,
          userName: "Operator",
          email: "operator@mbyte.com",
          contactNumber: "9876543210",
          roleId: 4,
          role: {
            roleId: 4,
            roleName: "Guest",
            active: true,
            createdOn: null,
            updatedOn: "2023-06-27T05:00:04.641023Z",
          },
          password: "123456",
          active: true,
          createdOn: "2023-06-02T11:38:55.221122Z",
          updatedOn: "2023-06-02T11:38:55.221122Z",
          ahid: null,
        },
      ])
    );
  }),
  rest.get(`${rootUrl}/role`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          roleId: 4,
          roleName: "Guest",
          active: true,
          createdOn: null,
          updatedOn: "2023-06-27T05:00:04.641023Z",
        },
        {
          roleId: 3,
          roleName: "Manager",
          active: true,
          createdOn: null,
          updatedOn: "2023-06-27T05:00:04.641023Z",
        },
        {
          roleId: 2,
          roleName: "Super User",
          active: true,
          createdOn: null,
          updatedOn: "2023-06-27T05:00:04.641023Z",
        },
      ])
    );
  }),
  rest.get(`${rootUrl}/user-access/authorization/:pageId`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        roleId: null,
        menuId: 1,
        feature: ["Add", "Edit", "View", "Delete"],
      })
    );
  }),
];
