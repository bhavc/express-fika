export const getGeographicRegionByCountry = async ({
	carrierCountry,
}: {
	carrierCountry: string;
}) => {
	try {
		// TODO maybe move to an external service
		const northAmericanCountries = ["Canada"];

		if (northAmericanCountries.includes(carrierCountry)) {
			return "northAmerica";
		}

		return "africa";
	} catch (err) {
		throw new Error(
			`groups.service: getGeographicRegionByCountry - Error gettings geographic region ${err.message}`
		);
	}
};
