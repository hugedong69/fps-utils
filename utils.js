"use strict";
const { join } = require("path");
const { writeFile, readFileSync } = require("fs");
const { entries: objectEntries, assign } = Object;
const { isArray } = Array;

const configPath = join(__dirname, "config.json");

const noop = () => {};

function parser(key, value) {
  if (
    value != null &&
    typeof value === "object" &&
    value.type === "Set" &&
    isArray(value.data)
  ) {
    return new Set(value.data);
  }
  return value;
}

const config = (() => {
  try {
    const json = readFileSync(configPath);
    const conf = JSON.parse(String(json), parser);
    if (typeof conf.version !== "number") throw null;
    return conf;
  }
  catch (_) {
    const defaults = require("./default-config");
    saveConfig(defaults);
    return defaults;
  }
})();

function saveConfig(conf = config) {
  conf = assign({}, conf);
  for (const [k, v] of objectEntries(conf)) {
    if (!(v instanceof Set)) continue;
    conf[k] = {
      type: "Set",
      data: [...v]
    };
  }
  writeFile(configPath, JSON.stringify(conf, null, 4), noop);
}

const longAsString = l => `${Number(l.unsigned)}:${l.low}:${l.high}`;

module.exports = {
  config,
  saveConfig,
  longAsString
};
