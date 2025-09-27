/**
 * Modern Module Registry System for HTML5 Game
 *
 * Features:
 * - Dynamic module discovery and loading
 * - Interface validation for type safety
 * - Caching for performance optimization
 * - Comprehensive error handling
 * - Static Hosting compatible (no file system scanning)
 */

/**
 * Module interface definitions for validation
 */
const MODULE_INTERFACES = {
  system: {
    required: ["name", "type"],
    optional: [
      "icon",
      "critical",
      "caveat",
      "deteriorate",
      "fix",
      "renderUI",
      "handleInteraction",
      "update",
      "initialize",
    ],
    methods: ["deteriorate", "fix"],
  },
  positiveEvent: {
    required: ["description"],
    optional: ["apply"],
    methods: ["apply"],
  },
  negativeEvent: {
    required: ["description"],
    optional: ["apply"],
    methods: ["apply"],
  },
};

/**
 * Cache for loaded modules to improve performance
 */
const moduleCache = new Map();

/**
 * Registry class for managing game modules
 */
class ModuleRegistry {
  constructor(options = {}) {
    this.options = {
      validateInterfaces: true,
      enableCaching: true,
      strictMode: false,
      ...options,
    };
    this.loadedModules = new Map();
    this.loadingPromises = new Map();
  }

  /**
   * Load all game modules using registry configuration
   * @param {Object} config - Registry configuration
   * @returns {Promise<Object>} Game configuration object
   */
  async load(config = {}) {
    try {
      console.log("🔄 Starting module registry load...");

      // Load all module types
      const [systems, positiveEvents, negativeEvents] = await Promise.all([
        this.loadModules(config.systems, "system"),
        this.loadModules(config.positiveEvents, "positiveEvent"),
        this.loadModules(config.negativeEvents, "negativeEvent"),
      ]);

      const result = {
        systems,
        positiveEvents,
        negativeEvents,
        registry: this,
      };

      console.log("✅ Module registry loaded successfully", {
        systemsCount: systems.length,
        positiveEventsCount: positiveEvents.length,
        negativeEventsCount: negativeEvents.length,
      });

      return result;
    } catch (error) {
      console.error("❌ Failed to load module registry:", error);
      throw new Error(`Registry load failed: ${error.message}`);
    }
  }

  /**
   * Load modules of a specific type with validation
   * @param {string[]} modulePaths - Array of module paths to load
   * @param {string} type - Type of modules being loaded
   * @returns {Promise<Array>} Array of loaded and validated modules
   */
  async loadModules(modulePaths, type) {
    if (!Array.isArray(modulePaths)) {
      throw new Error(`Invalid module paths for ${type}: expected array`);
    }

    const loadPromises = modulePaths.map((modulePath) =>
      this.loadModule(modulePath, type)
    );

    const modules = await Promise.all(loadPromises);

    // Filter out failed modules in non-strict mode
    return this.options.strictMode
      ? modules
      : modules.filter((module) => module !== null);
  }

  /**
   * Load a single module with caching and validation
   * @param {string} modulePath - Path to the module
   * @param {string} type - Expected module type
   * @returns {Promise<Object|null>} Loaded module or null if failed
   */
  async loadModule(modulePath, type) {
    try {
      // Check cache first
      if (this.options.enableCaching && moduleCache.has(modulePath)) {
        const cached = moduleCache.get(modulePath);
        if (cached.type === type) {
          return this.validateModule(cached.module, type);
        }
      }

      // Check for in-progress loading
      if (this.loadingPromises.has(modulePath)) {
        const existingPromise = this.loadingPromises.get(modulePath);
        const module = await existingPromise;
        return this.validateModule(module, type);
      }

      // Start loading
      const loadPromise = this._loadModuleInternal(modulePath, type);
      this.loadingPromises.set(modulePath, loadPromise);

      const module = await loadPromise;
      this.loadingPromises.delete(modulePath);

      // Cache the result
      if (this.options.enableCaching) {
        moduleCache.set(modulePath, { module, type });
      }

      return this.validateModule(module, type);
    } catch (error) {
      console.warn(`⚠️ Failed to load module ${modulePath}:`, error.message);

      if (this.options.strictMode) {
        throw error;
      }

      return null;
    }
  }

  /**
   * Internal module loading logic
   * @private
   */
  async _loadModuleInternal(modulePath, expectedType) {
    try {
      const module = await import(modulePath);
      const moduleName = Object.keys(module)[0];
      const moduleData = module[moduleName];

      if (!moduleData) {
        throw new Error(`Module ${modulePath} has no export`);
      }

      return {
        ...moduleData,
        _modulePath: modulePath,
        _loadedAt: new Date().toISOString(),
      };
    } catch (error) {
      throw new Error(`Failed to import ${modulePath}: ${error.message}`);
    }
  }

  /**
   * Validate module against interface requirements
   * @param {Object} module - Module to validate
   * @param {string} type - Expected module type
   * @returns {Object} Validated module
   */
  validateModule(module, type) {
    if (!this.options.validateInterfaces) {
      return module;
    }

    const interfaceDef = MODULE_INTERFACES[type];
    if (!interfaceDef) {
      console.warn(`⚠️ Unknown module type: ${type}`);
      return module;
    }

    // Check required properties
    for (const prop of interfaceDef.required) {
      if (!(prop in module)) {
        throw new Error(`Module missing required property: ${prop}`);
      }
    }

    // Validate methods exist and are functions
    if (interfaceDef.methods) {
      for (const method of interfaceDef.methods) {
        if (method in module && typeof module[method] !== "function") {
          throw new Error(`Module property ${method} is not a function`);
        }
      }
    }

    return module;
  }

  /**
   * Clear the module cache
   */
  clearCache() {
    moduleCache.clear();
    this.loadedModules.clear();
    console.log("🗑️ Module cache cleared");
  }

  /**
   * Get registry statistics
   */
  getStats() {
    return {
      cachedModules: moduleCache.size,
      loadedModules: this.loadedModules.size,
      activePromises: this.loadingPromises.size,
      cacheEnabled: this.options.enableCaching,
      validationEnabled: this.options.validateInterfaces,
    };
  }
}

/**
 * Convenience function to create and load registry
 * @param {Object} config - Registry configuration
 * @param {Object} options - Registry options
 * @returns {Promise<Object>} Game configuration object
 */
export async function loadGameModules(config = {}, options = {}) {
  const registry = new ModuleRegistry(options);
  return await registry.load(config);
}

/**
 * Default export - creates a new registry instance
 */
export default ModuleRegistry;

// Export interfaces for external use
export { MODULE_INTERFACES };
