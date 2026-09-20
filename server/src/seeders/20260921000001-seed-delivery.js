'use strict';

const { initialZones } = require('./seedDelivery');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const zones = await queryInterface.sequelize.query(
      'SELECT count(*) FROM delivery_zones',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    const count = parseInt(zones[0]?.count || '0', 10);
    if (count === 0) {
      const zonesData = initialZones.map((z) => ({
        ...z,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));
      await queryInterface.bulkInsert('delivery_zones', zonesData);
    }

    const settings = await queryInterface.sequelize.query(
      'SELECT count(*) FROM delivery_settings',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    const settingCount = parseInt(settings[0]?.count || '0', 10);
    if (settingCount === 0) {
      await queryInterface.bulkInsert('delivery_settings', [
        {
          pickupEnabled: true,
          pickupLocationName: 'Milton, ON',
          pickupAddress: 'Milton, Ontario (Exact address provided upon order confirmation)',
          unservicedAreaMessage:
            'Delivery may be available to your area. Please contact Hisna Gifts for delivery availability and pricing.',
          eventSetupMessage:
            'Delivery and setup fees are based on event location and setup requirements. Please contact us for a quote.',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);
    }
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('delivery_settings', null, {});
    await queryInterface.bulkDelete('delivery_zones', null, {});
  },
};
