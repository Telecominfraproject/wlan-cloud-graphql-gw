// Resolvers define the technique for fetching the types defined in the schema.
import { GraphQLJSONObject } from 'graphql-type-json';

const resolvers = {
  JSONObject: GraphQLJSONObject,
  Query: {
    getUser: async (_, { id }, { dataSources }) => {
      return dataSources.api.getUser(id);
    },
    getAllUsers: async (_, { customerId, cursor, limit, context }, { dataSources }) => {
      return dataSources.api.getAllUsers(customerId, cursor, limit, context);
    },

    getCustomer: async (_, { id }, { dataSources }) => {
      return dataSources.api.getCustomer(id);
    },
    findCustomer: async (_, {}, { dataSources }) => {
      return dataSources.api.findCustomer();
    },

    getLocation: async (_, { id }, { dataSources }) => {
      return dataSources.api.getLocation(id);
    },
    getAllLocations: async (_, { customerId }, { dataSources }) => {
      return dataSources.api.getAllLocations(customerId);
    },

    getEquipment: async (_, { id }, { dataSources }) => {
      return dataSources.api.getEquipment(id);
    },
    getAllEquipment: async (_, { customerId, cursor, limit, context }, { dataSources }) => {
      return dataSources.api.getAllEquipment(customerId, cursor, limit, context);
    },
    filterEquipment: async (
      _,
      { customerId, locationIds, equipmentType, cursor, limit, context },
      { dataSources }
    ) => {
      return dataSources.api.filterEquipment(
        customerId,
        locationIds,
        equipmentType,
        cursor,
        limit,
        context
      );
    },

    getEquipmentStatus: async (
      _,
      { customerId, equipmentIds, statusDataTypes },
      { dataSources }
    ) => {
      return dataSources.api.getEquipmentStatus(customerId, equipmentIds, statusDataTypes);
    },

    getClientSession: async (_, { customerId, macAddress }, { dataSources }) => {
      return dataSources.api.getClientSession(customerId, macAddress);
    },
    filterClientSessions: async (
      _,
      { customerId, locationIds, cursor, limit, context },
      { dataSources }
    ) => {
      return dataSources.api.filterClientSessions(customerId, locationIds, cursor, limit, context);
    },
    getClients: async (_, { customerId, macAddress }, { dataSources }) => {
      return dataSources.api.getClients(customerId, macAddress);
    },
    getBlockedClients: async (_, { customerId }, { dataSources }) => {
      return dataSources.api.getBlockedClients(customerId);
    },

    getProfile: async (_, { id }, { dataSources }) => {
      return dataSources.api.getProfile(id);
    },
    getAllProfiles: async (_, { customerId, cursor, limit, type, context }, { dataSources }) => {
      return dataSources.api.getAllProfiles({ customerId, cursor, limit, type, context });
    },

    getAllAlarms: async (_, { customerId, cursor, limit, context }, { dataSources }) => {
      return dataSources.api.getAllAlarms(customerId, cursor, limit, context);
    },
    getAlarmCount: async (_, { customerId }, { dataSources }) => {
      const result = await dataSources.api.getAlarmCount(customerId);

      let totalCount = 0;
      if (result && result.totalCountsPerAlarmCodeMap) {
        Object.keys(result.totalCountsPerAlarmCodeMap).forEach(
          (i) => (totalCount += result.totalCountsPerAlarmCodeMap[i])
        );
      }

      return totalCount;
    },

    filterServiceMetrics: async (
      _,
      { customerId, fromTime, toTime, clientMacs, equipmentIds, dataTypes, cursor, limit, context },
      { dataSources }
    ) => {
      return dataSources.api.filterServiceMetrics(
        customerId,
        fromTime,
        toTime,
        equipmentIds,
        clientMacs,
        dataTypes,
        cursor,
        limit,
        context
      );
    },
    filterSystemEvents: async (
      _,
      { customerId, fromTime, toTime, equipmentIds, dataTypes, cursor, limit, context },
      { dataSources }
    ) => {
      return dataSources.api.filterSystemEvents(
        customerId,
        fromTime,
        toTime,
        equipmentIds,
        dataTypes,
        cursor,
        limit,
        context
      );
    },

    getOui: async (_, { oui }, { dataSources }) => {
      return dataSources.api.getOui(oui);
    },
    getAllOui: async (_, {}, { dataSources }) => {
      return dataSources.api.getAllOui();
    },

    getAllFirmware: async (_, { modelId }, { dataSources }) => {
      return dataSources.api.getAllFirmware(modelId);
    },
    getAllFirmwareModelId: async (_, {}, { dataSources }) => {
      return dataSources.api.getAllFirmwareModelId();
    },
    getAllFirmwareTrackAssignment: async (_, {}, { dataSources }) => {
      return dataSources.api.getAllFirmwareTrackAssignment();
    },
    getFirmwareTrack: async (_, { firmwareTrackName }, { dataSources }) => {
      return dataSources.api.getFirmwareTrack(firmwareTrackName);
    },

    getAllStatus: async (
      _,
      { customerId, statusDataTypes, cursor, limit, context },
      { dataSources }
    ) => {
      return dataSources.api.getAllStatus(customerId, statusDataTypes, cursor, limit, context);
    },
  },
  Mutation: {
    authenticateUser: async (_, { email, password }, { dataSources }) => {
      return dataSources.api.createToken(email, password);
    },
    updateToken: async (_, { refreshToken }, { dataSources }) => {
      return dataSources.api.updateToken(refreshToken);
    },

    createUser: async (_, { username, password, role, customerId }, { dataSources }) => {
      return dataSources.api.createUser({ username, password, role, customerId });
    },
    updateUser: async (
      _,
      { id, username, password, role, customerId, lastModifiedTimestamp },
      { dataSources }
    ) => {
      return dataSources.api.updateUser({
        id,
        username,
        password,
        role,
        customerId,
        lastModifiedTimestamp,
      });
    },
    deleteUser: async (_, { id }, { dataSources }) => {
      return dataSources.api.deleteUser(id);
    },

    updateCustomer: async (_, data, { dataSources }) => {
      return dataSources.api.updateCustomer(data);
    },

    createLocation: async (_, { locationType, customerId, parentId, name }, { dataSources }) => {
      return dataSources.api.createLocation({ locationType, customerId, parentId, name });
    },
    updateLocation: async (
      _,
      { id, locationType, customerId, parentId, name, lastModifiedTimestamp, details },
      { dataSources }
    ) => {
      return dataSources.api.updateLocation({
        id,
        locationType,
        customerId,
        parentId,
        name,
        lastModifiedTimestamp,
        details,
      });
    },
    deleteLocation: async (_, { id }, { dataSources }) => {
      return dataSources.api.deleteLocation(id);
    },

    createEquipment: async (
      _,
      { inventoryId, customerId, profileId, locationId, name },
      { dataSources }
    ) => {
      return dataSources.api.createEquipment({
        inventoryId,
        customerId,
        profileId,
        locationId,
        name,
      });
    },
    updateEquipment: async (
      _,
      {
        id,
        equipmentType,
        inventoryId,
        customerId,
        profileId,
        locationId,
        name,
        latitude,
        longitude,
        serial,
        lastModifiedTimestamp,
        details,
      },
      { dataSources }
    ) => {
      return dataSources.api.updateEquipment({
        id,
        equipmentType,
        inventoryId,
        customerId,
        profileId,
        locationId,
        name,
        latitude,
        longitude,
        serial,
        lastModifiedTimestamp,
        details,
      });
    },
    updateEquipmentBulk: async (_, { items }, { dataSources }) => {
      return dataSources.api.updateEquipmentBulk(items);
    },
    deleteEquipment: async (_, { id }, { dataSources }) => {
      return dataSources.api.deleteEquipment(id);
    },
    updateEquipmentFirmware: async (_, { equipmentId, firmwareVersionId }, { dataSources }) => {
      return dataSources.api.updateEquipmentFirmware(equipmentId, firmwareVersionId);
    },
    requestEquipmentSwitchBank: async (_, { equipmentId }, { dataSources }) => {
      return dataSources.api.requestEquipmentSwitchBank(equipmentId);
    },
    requestEquipmentReboot: async (_, { equipmentId }, { dataSources }) => {
      return dataSources.api.requestEquipmentReboot(equipmentId);
    },
    requestEquipmentFactoryReset: async (_, { equipmentId }, { dataSources }) => {
      return dataSources.api.requestEquipmentFactoryReset(equipmentId);
    },

    createProfile: async (
      _,
      { profileType, customerId, name, childProfileIds, details },
      { dataSources }
    ) => {
      return dataSources.api.createProfile({
        profileType,
        customerId,
        name,
        childProfileIds,
        details,
      });
    },
    updateProfile: async (
      _,
      {
        id,
        profileType,
        customerId,
        name,
        childProfileIds,
        createdTimestamp,
        lastModifiedTimestamp,
        details,
      },
      { dataSources }
    ) => {
      return dataSources.api.updateProfile({
        id,
        profileType,
        customerId,
        name,
        childProfileIds,
        lastModifiedTimestamp,
        details,
      });
    },
    deleteProfile: async (_, { id }, { dataSources }) => {
      return dataSources.api.deleteProfile(id);
    },

    fileUpload: async (_, { fileName, file }, { dataSources }) => {
      return dataSources.api.fileUpload(fileName, file);
    },

    ouiUpload: async (_, { fileName, file }, { dataSources }) => {
      return dataSources.api.ouiUpload(fileName, file);
    },
    updateOui: async (_, { manufacturerAlias, manufacturerName, oui }, { dataSources }) => {
      return dataSources.api.updateOui({ manufacturerAlias, manufacturerName, oui });
    },

    createFirmware: async (_, data, { dataSources }) => {
      return dataSources.api.createFirmware(data);
    },
    updateFirmware: async (_, data, { dataSources }) => {
      return dataSources.api.updateFirmware(data);
    },
    deleteFirmware: async (_, { id }, { dataSources }) => {
      return dataSources.api.deleteFirmware(id);
    },

    updateFirmwareTrackAssignment: async (_, data, { dataSources }) => {
      return dataSources.api.updateFirmwareTrackAssignment(data);
    },
    deleteFirmwareTrackAssignment: async (
      _,
      { firmwareTrackId, firmwareVersionId },
      { dataSources }
    ) => {
      return dataSources.api.deleteFirmwareTrackAssignment(firmwareTrackId, firmwareVersionId);
    },

    addBlockedClient: async (_, { customerId, macAddress }, { dataSources }) => {
      const result = await dataSources.api.getClients(customerId, [macAddress]);

      if (result && result.length) {
        const client = { ...result[0] };
        if (!client.details.blocklistDetails) {
          client.details.blocklistDetails = {};
        }
        client.details.blocklistDetails.enabled = true;

        return dataSources.api.updateClient({ ...client });
      } else {
        const details = {
          blocklistDetails: { enabled: true },
          model_type: 'ClientInfoDetails',
        };

        return dataSources.api.updateClient({ customerId, macAddress, details });
      }
    },
    updateClient: async (_, data, { dataSources }) => {
      return dataSources.api.updateClient(data);
    },
  },
  Equipment: {
    profile: ({ profileId }, args, { dataSources }) => {
      return dataSources.api.getProfile(profileId);
    },
    status: ({ customerId, id }, args, { dataSources }) => {
      return dataSources.api.getEquipmentStatus(
        customerId,
        [id],
        ['PROTOCOL', 'OS_PERFORMANCE', 'RADIO_UTILIZATION', 'CLIENT_DETAILS', 'FIRMWARE']
      );
    },
    channel: ({ details }) => {
      const values = [];
      if (details && details.radioMap) {
        Object.keys(details.radioMap).forEach((i) =>
          values.push(details.radioMap[i].channelNumber)
        );
      }
      return values;
    },
    model: ({ details }) => details && details.equipmentModel,
    alarmsCount: async ({ customerId, id }, args, { dataSources }) => {
      const result = await dataSources.api.getAlarmCount(customerId, [id]);

      let totalCount = 0;
      if (result && result.totalCountsPerAlarmCodeMap) {
        Object.keys(result.totalCountsPerAlarmCodeMap).forEach(
          (i) => (totalCount += result.totalCountsPerAlarmCodeMap[i])
        );
      }

      return totalCount;
    },
    alarms: ({ customerId, id }, args, { dataSources }) => {
      return dataSources.api.getAllAlarmsForEquipment(customerId, [id]);
    },
    details: ({ details }) => details || {},
  },
  EquipmentStatus: {
    protocol: (items) => items.find((i) => i.statusDataType === 'PROTOCOL') || {},
    osPerformance: (items) => items.find((i) => i.statusDataType === 'OS_PERFORMANCE') || {},
    radioUtilization: (items) => items.find((i) => i.statusDataType === 'RADIO_UTILIZATION') || {},
    clientDetails: (items) => items.find((i) => i.statusDataType === 'CLIENT_DETAILS') || {},
    firmware: (items) => items.find((i) => i.statusDataType === 'FIRMWARE') || {},
    dashboard: (items) => items.find((i) => i.statusDataType === 'CUSTOMER_DASHBOARD') || {},
  },
  Status: {
    detailsJSON: ({ details }) => details || {},
    alarmsCount: ({ customerId }, args, { dataSources }) => {
      return dataSources.api.getAlarmCount(customerId);
    },
  },
  StatusDetails: {
    reportedMacAddr: ({ reportedMacAddr }) => reportedMacAddr && reportedMacAddr.addressAsString,
    capacityDetails: ({ capacityDetails }) => {
      const values = [];
      if (capacityDetails) {
        Object.keys(capacityDetails).forEach((i) => values.push(capacityDetails[i].usedCapacity));
      }
      return values;
    },
    noiseFloorDetails: ({ avgNoiseFloor }) => {
      const values = [];
      if (avgNoiseFloor) {
        Object.keys(avgNoiseFloor).forEach((i) => values.push(avgNoiseFloor[i]));
      }
      return values;
    },
    manufacturer: ({ reportedMacAddr }, args, { dataSources }) => {
      return (
        reportedMacAddr &&
        reportedMacAddr.addressAsString &&
        dataSources.api.getOuiLookup(
          reportedMacAddr.addressAsString.replace(/:/g, '').substring(0, 6)
        )
      );
    },
    numClientsPerRadio: ({ numClientsPerRadio }) => {
      const values = [];
      if (numClientsPerRadio) {
        Object.keys(numClientsPerRadio).forEach((i) => values.push(numClientsPerRadio[i]));
      }
      return values;
    },
    equipmentCountPerOui: async ({ equipmentCountPerOui }, args, { dataSources }) => {
      const result = {};

      if (equipmentCountPerOui) {
        for (const i in equipmentCountPerOui) {
          const oui = (await dataSources.api.getOuiLookup(i)) || i;
          if (!(oui in result)) {
            result[oui] = 0;
          }
          result[oui] += equipmentCountPerOui[i];
        }
      }

      return result;
    },
    clientCountPerOui: async ({ clientCountPerOui }, args, { dataSources }) => {
      const result = {};

      if (clientCountPerOui) {
        for (const i in clientCountPerOui) {
          const oui = (await dataSources.api.getOuiLookup(i)) || i;
          if (!(oui in result)) {
            result[oui] = 0;
          }
          result[oui] += clientCountPerOui[i];
        }
      }

      return result;
    },
  },
  Profile: {
    childProfiles: ({ childProfileIds }, args, { dataSources }) => {
      return dataSources.api.getProfilesById(childProfileIds);
    },
    equipmentCount: async ({ id }, args, { dataSources }) => {
      const result = await dataSources.api.getProfileCountById(id);

      return result && result.value2;
    },
  },
  ClientSession: {
    id: ({ macAddress }) => macAddress.addressAsString,
    macAddress: ({ macAddress }) => macAddress.addressAsString,
    ipAddress: ({ details }) => details.ipAddress,
    hostname: ({ details }) => details.hostname,
    ssid: ({ details }) => details.ssid,
    radioType: ({ details }) => details.radioType,
    signal: ({ details }) => details.metricDetails && details.metricDetails.rssi,
    manufacturer: ({ macAddress }, args, { dataSources }) => {
      return (
        macAddress &&
        macAddress.addressAsString &&
        dataSources.api.getOuiLookup(macAddress.addressAsString.replace(/:/g, '').substring(0, 6))
      );
    },
    equipment: ({ equipmentId }, args, { dataSources }) => {
      return dataSources.api.getEquipment(equipmentId);
    },
  },
  Client: {
    macAddress: ({ macAddress }) => macAddress.addressAsString,
  },
  Alarm: {
    equipment: ({ equipmentId }, args, { dataSources }) => {
      return dataSources.api.getEquipment(equipmentId);
    },
  },
  ServiceMetric: {
    rssi: ({ details }) => details.rssi,
    rxBytes: ({ details }) => details.rxBytes,
    txBytes: ({ details }) => details.numTxBytes,
    freeMemory: ({ details }) => details.apPerformance.freeMemory,
    cpuUtilized: ({ details }) => details.apPerformance.cpuUtilized,
    cpuTemperature: ({ details }) => details.apPerformance.cpuTemperature,
    detailsJSON: ({ details }) => details || {},
  },
  File: {
    baseUrl: ({}, args, { dataSources }) => {
      return dataSources.api.baseURL;
    },
  },
};

module.exports = resolvers;
