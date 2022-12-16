const camelCase = require('lodash.camelcase');
const latestSemver = require('latest-semver');

const { fetchLibraryVersions } = require('../utils');

function capitalize(str) {
  return str.substr(0, 1).toUpperCase() + str.substr(1);
}

function createNameAlternatives({ organization, name, templateConfig }) {
  return {
    packageName: `@${organization}/${
      templateConfig.packageNamePrefix || ''
    }${name}`,
    widgetType: `${organization}.${name}`,
    camelCaseName: camelCase(name),
    pascalCaseName: capitalize(camelCase(name)),
  };
}

async function getLibraryVersion(config, templateConfig) {
  const { libraryName } = templateConfig;
  const { libraryVersion } = config;

  if (libraryName && !libraryVersion) {
    const versions = await fetchLibraryVersions(libraryName);

    // Return the latest available version when
    // the stable version is not available
    return latestSemver(versions) || versions[0];
  }

  return libraryVersion;
}

async function postProcessAnswers({
  configuration,
  answers,
  optionsFromArguments,
  templatePath,
  templateConfig,
}) {
  const combinedAnswers = {
    ...configuration,
    ...answers,
  };

  const alternativeNames = createNameAlternatives({
    ...combinedAnswers,
    templateConfig,
  });

  const libraryVersion = await getLibraryVersion(
    combinedAnswers,
    templateConfig
  );

  return {
    ...combinedAnswers,
    ...alternativeNames,
    libraryVersion,
    template: templatePath,
    installation: optionsFromArguments.installation,
    currentYear: new Date().getFullYear(),
    attributesForFaceting:
      Array.isArray(combinedAnswers.attributesForFaceting) &&
      combinedAnswers.attributesForFaceting.filter(
        (attribute) => attribute !== 'ais.dynamicWidgets'
      ),
    flags: {
      dynamicWidgets:
        Array.isArray(combinedAnswers.attributesForFaceting) &&
        combinedAnswers.attributesForFaceting.includes('ais.dynamicWidgets'),
    },
  };
}

module.exports = postProcessAnswers;
