"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.editUserProfile = exports.getUserProfile = exports.createUserProfile = void 0;
const database_1 = require("../../core/database");
const createUserProfile = ({ id, company, }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield database_1.Db.insertInto("users")
            .values({
            id,
            company_name: company,
        })
            .executeTakeFirstOrThrow();
        const userProfile = {
            company,
        };
        return userProfile;
    }
    catch (err) {
        throw new Error(`users.service: createUserProfile - Error creating users profile ${err.message}`);
    }
});
exports.createUserProfile = createUserProfile;
const getUserProfile = ({ userId }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const numericId = parseInt(userId, 10);
        const data = yield database_1.Db.selectFrom("users")
            .selectAll()
            .where("id", "=", numericId)
            .executeTakeFirstOrThrow();
        return data;
    }
    catch (err) {
        throw new Error(`users.service: getUserProfile - Error getting users ${err.message}`);
    }
});
exports.getUserProfile = getUserProfile;
const editUserCarrierProfile = ({ userId, carrierData, }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("carrier data", carrierData);
        const { clientCompanyName, clientCompanyAddress, clientCompanyPhone, clientCompanyEmergencyPhone, clientRegionsServiced, clientAreasServiced, clientLanguagesSupported, clientHasSmartphoneAccess, clientHasLiveTracking, clientHasDashcam, } = carrierData;
        const carrierDataDb = {};
        if (clientCompanyName) {
            carrierDataDb.company_name = clientCompanyName;
        }
        if (clientCompanyAddress) {
            carrierDataDb.company_address = clientCompanyAddress;
        }
        if (clientCompanyPhone) {
            carrierDataDb.phone_number = clientCompanyPhone;
        }
        if (clientCompanyEmergencyPhone) {
            carrierDataDb.emergency_numbers = clientCompanyEmergencyPhone;
        }
        if (clientRegionsServiced) {
            carrierDataDb.region_serviced = clientRegionsServiced;
        }
        if (clientAreasServiced) {
            carrierDataDb.areas_serviced = clientAreasServiced;
        }
        if (clientLanguagesSupported) {
            carrierDataDb.languages_supported = clientLanguagesSupported;
        }
        if (clientHasSmartphoneAccess) {
            carrierDataDb.smartphone_access = clientHasSmartphoneAccess;
        }
        if (clientHasLiveTracking) {
            carrierDataDb.livetracking_available = clientHasLiveTracking;
        }
        if (clientHasDashcam) {
            carrierDataDb.dashcam_setup = clientHasDashcam;
        }
        const data = yield database_1.Db.updateTable("users")
            .set(carrierDataDb)
            .where("id", "=", userId)
            .executeTakeFirstOrThrow();
        return data.numUpdatedRows;
    }
    catch (err) {
        throw new Error(`users.service: editUserCarrierProfile - Error editing user ${err.message}`);
    }
});
const editUserProfile = ({ userId, userRole, data, }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const numericId = parseInt(userId, 10);
        if (userRole === "Carrier") {
            const carrierData = data;
            const numUpdatedRows = yield editUserCarrierProfile({
                userId: numericId,
                carrierData,
            });
            return numUpdatedRows;
        }
    }
    catch (err) {
        throw new Error(`users.service: editUserProfile - Error editing user ${err.message}`);
    }
});
exports.editUserProfile = editUserProfile;
//# sourceMappingURL=service.js.map