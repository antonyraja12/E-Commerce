import ContinentService from "../../../services/continent-service";
import CountryService from "../../../services/country-service";
import StateService from "../../../services/state-service";
// import PlantService from "../../../services/plant-service";
import AppHierarchyService from "../../../services/app-hierarchy/app-hierarchy-service";
import AssetParametersService from "../../../services/asset-parameters-service";
import AssetService from "../../../services/asset-service";
import MaintenanceTypeService from "../../../services/preventive-maintenance-services/maintenance-type-service";
import RoleService from "../../../services/role-service";
import ShiftAllocationService from "../../../services/shift-configuration/shift-allocation-service";
import CurrentUserService from "../../../services/user-list-current-user-service";
import UserService from "../../../services/user-service";
import PageList from "../../../utils/page/page-list";
import InventoryCategoryService from "../../../services/inventory-services/inventory-category-service";

class FilterFunctions extends PageList {
  continentService = new ContinentService();
  countryService = new CountryService();
  stateService = new StateService();
  // customerService = new PlantService();
  assetService = new AssetService();
  currentuserService = new CurrentUserService();
  appHierarchyService = new AppHierarchyService();
  roleService = new RoleService();
  userService = new UserService();
  parameterService = new AssetParametersService();
  userService = new UserService();
  parameterService = new AssetParametersService();
  maintenanceservice = new MaintenanceTypeService();
  shiftAllocationService = new ShiftAllocationService();
  inventoryCategoryService = new InventoryCategoryService();

  constructor(props) {
    super(props);
    this.getContinentList = this.getContinentList.bind(this);
    this.getCountryList = this.getCountryList.bind(this);
    this.getStateList = this.getStateList.bind(this);
    // this.getCustomerList = this.getCustomerList.bind(this);
    this.getAssetList = this.getAssetList.bind(this);
    this.getShiftNamesList = this.getShiftNamesList.bind(this);
    this.getAppHierarchyList = this.getAppHierarchyList.bind(this);
    this.getRoleList = this.getRoleList.bind(this);
    this.getUserList = this.getUserList.bind(this);
    // this.getUserList = this.getUserList.bind(this);
    this.getCurrentUserList = this.getCurrentUserList.bind(this);
    this.getCurrentUser = this.getCurrentUser.bind(this);
    this.getCategoryList = this.getCategoryList.bind(this);
  }

  getContinentList() {
    this.setState((state, props) => ({
      ...state,
      isContinentListLoading: true,
      continentList: [],
      countryList: [],
      stateList: [],
    }));

    this.continentService
      .list({ active: true })
      .then((response) => {
        this.setState(
          (state, props) => ({
            ...state,
            continentList: response.data?.map((e) => ({
              label: e.continentName,
              value: e.continentId,
            })),
          }),
          () => {
            this.props.form?.setFieldsValue({
              regionId: response.data.length
                ? response.data[0].continentId
                : null,
              region: response.data.length
                ? response.data[0].continentId
                : null,
            });
            this.getCountryList(
              response.data.length ? response.data[0].continentId : null
            );
          }
        );
      })
      .finally(() => {
        this.setState((state, props) => ({
          ...state,
          isContinentListLoading: false,
        }));
      });
  }

  getCountryList(continentId) {
    this.setState((state, props) => ({
      ...state,
      isCountryListLoading: true,
      countryList: [],
      stateList: [],
    }));

    this.countryService
      .list({ active: true, continentId: continentId })
      .then((response) => {
        this.setState(
          (state, props) => ({
            ...state,
            countryList: response.data?.map((e) => ({
              label: e.countryName,
              value: e.countryId,
            })),
          }),
          () => {
            this.props.form?.setFieldsValue({
              countryId: response.data[0]?.countryId,
              country: response.data[0]?.countryId,
            });
            this.getStateList(response.data[0]?.countryId);
          }
        );
      })
      .finally(() => {
        this.setState((state, props) => ({
          ...state,
          isCountryListLoading: false,
        }));
      });
  }

  getStateList(countryId, url) {
    this.setState((state, props) => ({
      ...state,
      isStateListLoading: true,
      stateList: [],
    }));

    this.stateService
      .list({ active: true, countryId: countryId })
      .then((response) => {
        this.setState(
          (state, props) => ({
            ...state,
            stateList: response.data?.map((e) => ({
              label: e.stateName,
              value: e.stateId,
            })),
          }),
          () => {
            this.props.form?.setFieldsValue({
              stateId: response.data[0]?.stateId,
              state: response.data[0]?.stateId,
            });
            this.getCustomerList(response.data[0]?.stateId);
          }
        );
      })
      .finally(() => {
        this.setState((state, props) => ({
          ...state,
          isStateListLoading: false,
        }));
      });
  }

  getRoleList(roleId) {
    this.setState((state, props) => ({
      ...state,
      isRoleListLoading: true,
      roleList: [],
    }));

    this.roleService
      .list({ active: true, roleId: roleId })
      // .list({ active: true, roleId: roleId })
      .then((response) => {
        this.setState((state, props) => ({
          ...state,
          roleList: response.data?.map((e) => ({
            label: e.roleName,
            value: e.roleId,
          })),
        }));
      })
      .finally(() => {
        this.setState((state, props) => ({
          ...state,
          isRoleListLoading: false,
        }));
      });
  }
  getUserList(aHId) {
    this.setState((state, props) => ({
      ...state,
      isUserListLoading: true,
      userList: [],
    }));
    // console.log(userId, "userId");
    this.userService
      .list({ active: true, aHId: aHId })
      .then((response) => {
        this.setState(
          (state, props) => ({
            ...state,
            userList: response.data?.map((e) => ({
              label: e.userName,
              value: e.userId,
            })),
          }),
          () => {
            this.props.form.setFieldsValue({
              userId: response.data[0]?.userId,
              user: response.data[0]?.userId,
            });
            // this.getUserList(response.data[0]?.userId);
          }
        );
      })
      .finally(() => {
        this.setState((state, props) => ({
          ...state,
          isUserListLoading: false,
        }));
      });
  }

  getUserGroupList(userGroupId) {
    this.setState((state, props) => ({
      ...state,
      isUserGroupListLoading: true,
      userGroupList: [],
    }));

    this.userGroupService
      .list({ active: true, userGroupId: userGroupId })
      .then((response) => {
        this.setState(
          (state, props) => ({
            ...state,
            userGroupList: response.data?.map((e) => ({
              label: e.userGroupName,
              value: e.userGroupId,
            })),
          }),
          () => {
            this.props.form.setFieldsValue({
              userGroupId: response.data[0]?.userId,
              userGroup: response.data[0]?.userId,
            });
          }
        );
      })
      .finally(() => {
        this.setState((state, props) => ({
          ...state,
          isUserGroupListLoading: false,
        }));
      });
  }

  getAppHierarchyList() {
    this.setState((state) => ({ ...state, isParentLoading: true }));
    this.appHierarchyService
      .list({ active: true })
      .then(({ data }) => {
        this.setState(
          (state) => ({
            ...state,
            parentTreeList: this.appHierarchyService.convertToSelectTree(data),
          }),
          () => {
            this.props.form?.setFieldValue(
              "ahId",

              this.state.parentTreeList[0]?.value
            );
          }
        );
      })
      .finally(() => {
        this.setState((state) => ({ ...state, isParentLoading: false }));
      });
  }

  getCurrentUserList() {
    this.currentuserService
      .list({ active: true, published: true })
      .then(({ data }) => {
        this.setState(
          (state) => ({
            ...state,
            currentUserList: [{ value: data.userName, label: data.userName }],
          }),
          () => {
            this.props.form?.setFieldValue("UserName", data.userName);
          }
        );
      })
      .finally(() => {
        this.setState((state) => ({
          ...state,
          isCurrentListLoading: false,
        }));
      });
  }

  getCurrentUser() {
    this.setState((state) => ({
      ...state,
      isCurrentUserLoading: true,
      currentUser: [],
    }));
    this.currentuserService
      .getUser()
      .then(({ data }) => {
        this.setState((state) => ({
          ...state,
          currentUser: data,
        }));
      })
      .finally(() => {
        this.setState((state) => ({
          ...state,
          isCurrentUserLoading: false,
        }));
      });
  }

  getAssetList(aHId) {
    this.setState((state, props) => ({
      ...state,
      isAssetListLoading: true,
      assetList: [],
    }));
    // console.log("aHId", aHId);
    this.assetService
      .list({ active: true, aHId: aHId })
      .then((response) => {
        this.setState(
          (state, props) => ({
            ...state,
            assetList: response.data?.map((e) => ({
              label: e.assetName,
              value: e.assetId,
              ahid: e.ahid,
            })),
          }),
          () => {
            this.props.form?.setFieldsValue({
              assetId: response.data[0]?.assetId,
              asset: response.data[0]?.assetId,
            });
          }
        );
        // this.callbackAsset(response.data);
      })
      .finally(() => {
        this.setState((state, props) => ({
          ...state,
          isAssetListLoading: false,
        }));
      });
  }
  getShiftNamesList(aHId, assetId = null) {
    this.setState((state, props) => ({
      ...state,
      isShiftNamesListLoading: true,
      shiftNamesList: [],
    }));

    this.shiftAllocationService
      .getShiftNames(aHId, assetId)
      .then((response) => {
        this.setState((state, props) => ({
          ...state,
          shiftNamesList: response.data?.map((e) => ({
            label: e,
            value: e,
          })),
        }));
      })
      .finally(() => {
        this.setState((state, props) => ({
          ...state,
          isShiftNamesListLoading: false,
        }));
      });
  }
  getMaintenaceTypeList() {
    this.setState((state, props) => ({
      ...state,
      isMaintenanceListLoadig: true,
      maintenanceType: [],
    }));

    this.maintenanceservice
      .list({ active: true })
      .then((response) => {
        this.setState((state, props) => ({
          ...state,
          maintenanceType: response.data?.map((e) => ({
            label: e.maintenanceTypeName,
            value: e.maintenanceTypeId,
          })),
        }));
      })
      .finally(() => {
        this.setState((state, props) => ({
          ...state,
          isMaintenanceListLoadig: false,
        }));
      });
  }
  getAssetParameters(assetId) {
    this.setState((state, props) => ({
      ...state,
      isAssetParametersLoading: true,
      assetParameters: [],
    }));

    this.parameterService
      .list({ assetId: assetId })
      .then((response) => {
        this.setState(
          (state, props) => ({
            ...state,
            assetParameters: response.data,
          }),
          () => {
            this.props.form?.setFieldsValue({
              parameterId: response.data[0]?.parameterId,
              parameterName: response.data[0]?.parameterName,
            });
          }
        );
      })
      .finally(() => {
        this.setState((state, props) => ({
          ...state,
          isAssetParametersLoading: false,
        }));
      });
  }
  getCategoryList() {
    this.setState((state, props) => ({
      ...state,
      isCategoryListLoading: true,
      categoryList: [],
    }));
    // console.log(userId, "userId");
    this.inventoryCategoryService
      .list({ status: true })
      .then((response) => {
        this.setState(
          (state, props) => ({
            ...state,
            categoryList: response.data?.map((e) => ({
              label: e.sparePartTypeName,
              value: e.sparePartTypeId,
            })),
          }),
          () => {
            this.props.form.setFieldsValue({
              sparePartTypeId: response.data[0]?.sparePartTypeId,
              // category: response.data[0]?.sparePartTypeId,
            });
            // this.getUserList(response.data[0]?.userId);
          }
        );
      })
      .finally(() => {
        this.setState((state, props) => ({
          ...state,
          isCategoryListLoading: false,
        }));
      });
  }
}

export default FilterFunctions;
