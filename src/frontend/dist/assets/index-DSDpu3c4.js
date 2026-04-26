var __typeError = (msg) => {
  throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var _client, _currentQuery, _currentQueryInitialState, _currentResult, _currentResultState, _currentResultOptions, _currentThenable, _selectError, _selectFn, _selectResult, _lastQueryWithDefinedData, _staleTimeoutId, _refetchIntervalId, _currentRefetchInterval, _trackedProps, _QueryObserver_instances, executeFetch_fn, updateStaleTimeout_fn, computeRefetchInterval_fn, updateRefetchInterval_fn, updateTimers_fn, clearStaleTimeout_fn, clearRefetchInterval_fn, updateQuery_fn, notify_fn, _a, _client2, _currentResult2, _currentMutation, _mutateOptions, _MutationObserver_instances, updateResult_fn, notify_fn2, _b;
import { o as ProtocolError, T as TimeoutWaitingForResponseErrorCode, p as utf8ToBytes, E as ExternalError, M as MissingRootKeyErrorCode, C as Certificate, q as lookupResultToBuffer, t as RequestStatusResponseStatus, U as UnknownError, v as RequestStatusDoneNoReplyErrorCode, w as RejectError, x as CertifiedRejectErrorCode, y as UNREACHABLE_ERROR, I as InputError, z as InvalidReadStateRequestErrorCode, B as ReadRequestType, P as Principal, D as IDL, F as MissingCanisterIdErrorCode, H as HttpAgent, G as encode, Q as QueryResponseStatus, J as UncertifiedRejectErrorCode, K as isV3ResponseBody, L as isV2ResponseBody, N as UncertifiedRejectUpdateErrorCode, O as UnexpectedErrorCode, V as decode, W as Subscribable, Y as pendingThenable, Z as resolveEnabled, $ as shallowEqualObjects, a0 as resolveStaleTime, a1 as noop, a2 as environmentManager, a3 as isValidTimeout, a4 as timeUntilStale, a5 as timeoutManager, a6 as focusManager, a7 as fetchState, a8 as replaceData, a9 as notifyManager, aa as hashKey, ab as getDefaultState, r as reactExports, ac as shouldThrowError, d as useQueryClient, h as useInternetIdentity, ad as createActorWithConfig, j as jsxRuntimeExports, R as React, ae as Record, af as Opt, ag as Variant, ah as Vec, ai as Service, aj as Func, ak as Text, al as Principal$1, am as Nat, an as Tuple, ao as Bool, ap as Null, aq as Int, ar as Nat8, as as Float64, _ as __vitePreload, at as JSON_KEY_PRINCIPAL, au as base32Decode, av as base32Encode, aw as getCrc32 } from "./index-CRJrpZcN.js";
const FIVE_MINUTES_IN_MSEC = 5 * 60 * 1e3;
function defaultStrategy() {
  return chain(conditionalDelay(once(), 1e3), backoff(1e3, 1.2), timeout(FIVE_MINUTES_IN_MSEC));
}
function once() {
  let first = true;
  return async () => {
    if (first) {
      first = false;
      return true;
    }
    return false;
  };
}
function conditionalDelay(condition, timeInMsec) {
  return async (canisterId, requestId, status) => {
    if (await condition(canisterId, requestId, status)) {
      return new Promise((resolve) => setTimeout(resolve, timeInMsec));
    }
  };
}
function timeout(timeInMsec) {
  const end = Date.now() + timeInMsec;
  return async (_canisterId, requestId, status) => {
    if (Date.now() > end) {
      throw ProtocolError.fromCode(new TimeoutWaitingForResponseErrorCode(`Request timed out after ${timeInMsec} msec`, requestId, status));
    }
  };
}
function backoff(startingThrottleInMsec, backoffFactor) {
  let currentThrottling = startingThrottleInMsec;
  return () => new Promise((resolve) => setTimeout(() => {
    currentThrottling *= backoffFactor;
    resolve();
  }, currentThrottling));
}
function chain(...strategies) {
  return async (canisterId, requestId, status) => {
    for (const a of strategies) {
      await a(canisterId, requestId, status);
    }
  };
}
const DEFAULT_POLLING_OPTIONS = {
  preSignReadStateRequest: false
};
function hasProperty(value, property) {
  return Object.prototype.hasOwnProperty.call(value, property);
}
function isObjectWithProperty(value, property) {
  return value !== null && typeof value === "object" && hasProperty(value, property);
}
function hasFunction(value, property) {
  return hasProperty(value, property) && typeof value[property] === "function";
}
function isSignedReadStateRequestWithExpiry(value) {
  return isObjectWithProperty(value, "body") && isObjectWithProperty(value.body, "content") && value.body.content.request_type === ReadRequestType.ReadState && isObjectWithProperty(value.body.content, "ingress_expiry") && typeof value.body.content.ingress_expiry === "object" && value.body.content.ingress_expiry !== null && hasFunction(value.body.content.ingress_expiry, "toHash");
}
async function pollForResponse(agent, canisterId, requestId, options = {}) {
  const path = [utf8ToBytes("request_status"), requestId];
  let state;
  let currentRequest;
  const preSignReadStateRequest = options.preSignReadStateRequest ?? false;
  if (preSignReadStateRequest) {
    currentRequest = await constructRequest({
      paths: [path],
      agent,
      pollingOptions: options
    });
    state = await agent.readState(canisterId, { paths: [path] }, void 0, currentRequest);
  } else {
    state = await agent.readState(canisterId, { paths: [path] });
  }
  if (agent.rootKey == null) {
    throw ExternalError.fromCode(new MissingRootKeyErrorCode());
  }
  const cert = await Certificate.create({
    certificate: state.certificate,
    rootKey: agent.rootKey,
    canisterId,
    blsVerify: options.blsVerify,
    agent
  });
  const maybeBuf = lookupResultToBuffer(cert.lookup_path([...path, utf8ToBytes("status")]));
  let status;
  if (typeof maybeBuf === "undefined") {
    status = RequestStatusResponseStatus.Unknown;
  } else {
    status = new TextDecoder().decode(maybeBuf);
  }
  switch (status) {
    case RequestStatusResponseStatus.Replied: {
      return {
        reply: lookupResultToBuffer(cert.lookup_path([...path, "reply"])),
        certificate: cert
      };
    }
    case RequestStatusResponseStatus.Received:
    case RequestStatusResponseStatus.Unknown:
    case RequestStatusResponseStatus.Processing: {
      const strategy = options.strategy ?? defaultStrategy();
      await strategy(canisterId, requestId, status);
      return pollForResponse(agent, canisterId, requestId, {
        ...options,
        // Pass over either the strategy already provided or the new one created above
        strategy,
        request: currentRequest
      });
    }
    case RequestStatusResponseStatus.Rejected: {
      const rejectCode = new Uint8Array(lookupResultToBuffer(cert.lookup_path([...path, "reject_code"])))[0];
      const rejectMessage = new TextDecoder().decode(lookupResultToBuffer(cert.lookup_path([...path, "reject_message"])));
      const errorCodeBuf = lookupResultToBuffer(cert.lookup_path([...path, "error_code"]));
      const errorCode = errorCodeBuf ? new TextDecoder().decode(errorCodeBuf) : void 0;
      throw RejectError.fromCode(new CertifiedRejectErrorCode(requestId, rejectCode, rejectMessage, errorCode));
    }
    case RequestStatusResponseStatus.Done:
      throw UnknownError.fromCode(new RequestStatusDoneNoReplyErrorCode(requestId));
  }
  throw UNREACHABLE_ERROR;
}
async function constructRequest(options) {
  var _a2;
  const { paths, agent, pollingOptions } = options;
  if (pollingOptions.request && isSignedReadStateRequestWithExpiry(pollingOptions.request)) {
    return pollingOptions.request;
  }
  const request = await ((_a2 = agent.createReadStateRequest) == null ? void 0 : _a2.call(agent, {
    paths
  }, void 0));
  if (!isSignedReadStateRequestWithExpiry(request)) {
    throw InputError.fromCode(new InvalidReadStateRequestErrorCode(request));
  }
  return request;
}
const metadataSymbol = Symbol.for("ic-agent-metadata");
class Actor {
  /**
   * Get the Agent class this Actor would call, or undefined if the Actor would use
   * the default agent (global.ic.agent).
   * @param actor The actor to get the agent of.
   */
  static agentOf(actor) {
    return actor[metadataSymbol].config.agent;
  }
  /**
   * Get the interface of an actor, in the form of an instance of a Service.
   * @param actor The actor to get the interface of.
   */
  static interfaceOf(actor) {
    return actor[metadataSymbol].service;
  }
  static canisterIdOf(actor) {
    return Principal.from(actor[metadataSymbol].config.canisterId);
  }
  static createActorClass(interfaceFactory, options) {
    const service = interfaceFactory({ IDL });
    class CanisterActor extends Actor {
      constructor(config) {
        if (!config.canisterId) {
          throw InputError.fromCode(new MissingCanisterIdErrorCode(config.canisterId));
        }
        const canisterId = typeof config.canisterId === "string" ? Principal.fromText(config.canisterId) : config.canisterId;
        super({
          config: {
            ...DEFAULT_ACTOR_CONFIG,
            ...config,
            canisterId
          },
          service
        });
        for (const [methodName, func] of service._fields) {
          if (options == null ? void 0 : options.httpDetails) {
            func.annotations.push(ACTOR_METHOD_WITH_HTTP_DETAILS);
          }
          if (options == null ? void 0 : options.certificate) {
            func.annotations.push(ACTOR_METHOD_WITH_CERTIFICATE);
          }
          this[methodName] = _createActorMethod(this, methodName, func, config.blsVerify);
        }
      }
    }
    return CanisterActor;
  }
  /**
   * Creates an actor with the given interface factory and configuration.
   *
   * The [`@icp-sdk/bindgen`](https://js.icp.build/bindgen/) package can be used to generate the interface factory for your canister.
   * @param interfaceFactory - the interface factory for the actor, typically generated by the [`@icp-sdk/bindgen`](https://js.icp.build/bindgen/) package
   * @param configuration - the configuration for the actor
   * @returns an actor with the given interface factory and configuration
   * @example
   * Using the interface factory generated by the [`@icp-sdk/bindgen`](https://js.icp.build/bindgen/) package:
   * ```ts
   * import { Actor, HttpAgent } from '@icp-sdk/core/agent';
   * import { Principal } from '@icp-sdk/core/principal';
   * import { idlFactory } from './api/declarations/hello-world.did';
   *
   * const canisterId = Principal.fromText('rrkah-fqaaa-aaaaa-aaaaq-cai');
   *
   * const agent = await HttpAgent.create({
   *   host: 'https://icp-api.io',
   * });
   *
   * const actor = Actor.createActor(idlFactory, {
   *   agent,
   *   canisterId,
   * });
   *
   * const response = await actor.greet('world');
   * console.log(response);
   * ```
   * @example
   * Using the `createActor` wrapper function generated by the [`@icp-sdk/bindgen`](https://js.icp.build/bindgen/) package:
   * ```ts
   * import { HttpAgent } from '@icp-sdk/core/agent';
   * import { Principal } from '@icp-sdk/core/principal';
   * import { createActor } from './api/hello-world';
   *
   * const canisterId = Principal.fromText('rrkah-fqaaa-aaaaa-aaaaq-cai');
   *
   * const agent = await HttpAgent.create({
   *   host: 'https://icp-api.io',
   * });
   *
   * const actor = createActor(canisterId, {
   *   agent,
   * });
   *
   * const response = await actor.greet('world');
   * console.log(response);
   * ```
   */
  static createActor(interfaceFactory, configuration) {
    if (!configuration.canisterId) {
      throw InputError.fromCode(new MissingCanisterIdErrorCode(configuration.canisterId));
    }
    return new (this.createActorClass(interfaceFactory))(configuration);
  }
  /**
   * Returns an actor with methods that return the http response details along with the result
   * @param interfaceFactory - the interface factory for the actor
   * @param configuration - the configuration for the actor
   * @deprecated - use createActor with actorClassOptions instead
   */
  static createActorWithHttpDetails(interfaceFactory, configuration) {
    return new (this.createActorClass(interfaceFactory, { httpDetails: true }))(configuration);
  }
  /**
   * Returns an actor with methods that return the http response details along with the result
   * @param interfaceFactory - the interface factory for the actor
   * @param configuration - the configuration for the actor
   * @param actorClassOptions - options for the actor class extended details to return with the result
   */
  static createActorWithExtendedDetails(interfaceFactory, configuration, actorClassOptions = {
    httpDetails: true,
    certificate: true
  }) {
    return new (this.createActorClass(interfaceFactory, actorClassOptions))(configuration);
  }
  constructor(metadata) {
    this[metadataSymbol] = Object.freeze(metadata);
  }
}
function decodeReturnValue(types, msg) {
  const returnValues = decode(types, msg);
  switch (returnValues.length) {
    case 0:
      return void 0;
    case 1:
      return returnValues[0];
    default:
      return returnValues;
  }
}
const DEFAULT_ACTOR_CONFIG = {
  pollingOptions: DEFAULT_POLLING_OPTIONS
};
const ACTOR_METHOD_WITH_HTTP_DETAILS = "http-details";
const ACTOR_METHOD_WITH_CERTIFICATE = "certificate";
function _createActorMethod(actor, methodName, func, blsVerify) {
  let caller;
  if (func.annotations.includes("query") || func.annotations.includes("composite_query")) {
    caller = async (options, ...args) => {
      var _a2, _b2;
      options = {
        ...options,
        ...(_b2 = (_a2 = actor[metadataSymbol].config).queryTransform) == null ? void 0 : _b2.call(_a2, methodName, args, {
          ...actor[metadataSymbol].config,
          ...options
        })
      };
      const agent = options.agent || actor[metadataSymbol].config.agent || new HttpAgent();
      const cid = Principal.from(options.canisterId || actor[metadataSymbol].config.canisterId);
      const arg = encode(func.argTypes, args);
      const result = await agent.query(cid, {
        methodName,
        arg,
        effectiveCanisterId: options.effectiveCanisterId
      });
      const httpDetails = {
        ...result.httpDetails,
        requestDetails: result.requestDetails
      };
      switch (result.status) {
        case QueryResponseStatus.Rejected: {
          const uncertifiedRejectErrorCode = new UncertifiedRejectErrorCode(result.requestId, result.reject_code, result.reject_message, result.error_code, result.signatures);
          uncertifiedRejectErrorCode.callContext = {
            canisterId: cid,
            methodName,
            httpDetails
          };
          throw RejectError.fromCode(uncertifiedRejectErrorCode);
        }
        case QueryResponseStatus.Replied:
          return func.annotations.includes(ACTOR_METHOD_WITH_HTTP_DETAILS) ? {
            httpDetails,
            result: decodeReturnValue(func.retTypes, result.reply.arg)
          } : decodeReturnValue(func.retTypes, result.reply.arg);
      }
    };
  } else {
    caller = async (options, ...args) => {
      var _a2, _b2;
      options = {
        ...options,
        ...(_b2 = (_a2 = actor[metadataSymbol].config).callTransform) == null ? void 0 : _b2.call(_a2, methodName, args, {
          ...actor[metadataSymbol].config,
          ...options
        })
      };
      const agent = options.agent || actor[metadataSymbol].config.agent || HttpAgent.createSync();
      const { canisterId, effectiveCanisterId, pollingOptions } = {
        ...DEFAULT_ACTOR_CONFIG,
        ...actor[metadataSymbol].config,
        ...options
      };
      const cid = Principal.from(canisterId);
      const ecid = effectiveCanisterId !== void 0 ? Principal.from(effectiveCanisterId) : cid;
      const arg = encode(func.argTypes, args);
      const { requestId, response, requestDetails } = await agent.call(cid, {
        methodName,
        arg,
        effectiveCanisterId: ecid,
        nonce: options.nonce
      });
      let reply;
      let certificate;
      if (isV3ResponseBody(response.body)) {
        if (agent.rootKey == null) {
          throw ExternalError.fromCode(new MissingRootKeyErrorCode());
        }
        const cert = response.body.certificate;
        certificate = await Certificate.create({
          certificate: cert,
          rootKey: agent.rootKey,
          canisterId: ecid,
          blsVerify,
          agent
        });
        const path = [utf8ToBytes("request_status"), requestId];
        const status = new TextDecoder().decode(lookupResultToBuffer(certificate.lookup_path([...path, "status"])));
        switch (status) {
          case "replied":
            reply = lookupResultToBuffer(certificate.lookup_path([...path, "reply"]));
            break;
          case "rejected": {
            const rejectCode = new Uint8Array(lookupResultToBuffer(certificate.lookup_path([...path, "reject_code"])))[0];
            const rejectMessage = new TextDecoder().decode(lookupResultToBuffer(certificate.lookup_path([...path, "reject_message"])));
            const error_code_buf = lookupResultToBuffer(certificate.lookup_path([...path, "error_code"]));
            const error_code = error_code_buf ? new TextDecoder().decode(error_code_buf) : void 0;
            const certifiedRejectErrorCode = new CertifiedRejectErrorCode(requestId, rejectCode, rejectMessage, error_code);
            certifiedRejectErrorCode.callContext = {
              canisterId: cid,
              methodName,
              httpDetails: response
            };
            throw RejectError.fromCode(certifiedRejectErrorCode);
          }
        }
      } else if (isV2ResponseBody(response.body)) {
        const { reject_code, reject_message, error_code } = response.body;
        const errorCode = new UncertifiedRejectUpdateErrorCode(requestId, reject_code, reject_message, error_code);
        errorCode.callContext = {
          canisterId: cid,
          methodName,
          httpDetails: response
        };
        throw RejectError.fromCode(errorCode);
      }
      if (response.status === 202) {
        const pollOptions = {
          ...pollingOptions,
          blsVerify
        };
        const response2 = await pollForResponse(agent, ecid, requestId, pollOptions);
        certificate = response2.certificate;
        reply = response2.reply;
      }
      const shouldIncludeHttpDetails = func.annotations.includes(ACTOR_METHOD_WITH_HTTP_DETAILS);
      const shouldIncludeCertificate = func.annotations.includes(ACTOR_METHOD_WITH_CERTIFICATE);
      const httpDetails = { ...response, requestDetails };
      if (reply !== void 0) {
        if (shouldIncludeHttpDetails && shouldIncludeCertificate) {
          return {
            httpDetails,
            certificate,
            result: decodeReturnValue(func.retTypes, reply)
          };
        } else if (shouldIncludeCertificate) {
          return {
            certificate,
            result: decodeReturnValue(func.retTypes, reply)
          };
        } else if (shouldIncludeHttpDetails) {
          return {
            httpDetails,
            result: decodeReturnValue(func.retTypes, reply)
          };
        }
        return decodeReturnValue(func.retTypes, reply);
      } else {
        const errorCode = new UnexpectedErrorCode(`Call was returned undefined. We cannot determine if the call was successful or not. Return types: [${func.retTypes.map((t) => t.display()).join(",")}].`);
        errorCode.callContext = {
          canisterId: cid,
          methodName,
          httpDetails
        };
        throw UnknownError.fromCode(errorCode);
      }
    };
  }
  const handler = (...args) => caller({}, ...args);
  handler.withOptions = (options) => (...args) => caller(options, ...args);
  return handler;
}
var QueryObserver = (_a = class extends Subscribable {
  constructor(client, options) {
    super();
    __privateAdd(this, _QueryObserver_instances);
    __privateAdd(this, _client);
    __privateAdd(this, _currentQuery);
    __privateAdd(this, _currentQueryInitialState);
    __privateAdd(this, _currentResult);
    __privateAdd(this, _currentResultState);
    __privateAdd(this, _currentResultOptions);
    __privateAdd(this, _currentThenable);
    __privateAdd(this, _selectError);
    __privateAdd(this, _selectFn);
    __privateAdd(this, _selectResult);
    // This property keeps track of the last query with defined data.
    // It will be used to pass the previous data and query to the placeholder function between renders.
    __privateAdd(this, _lastQueryWithDefinedData);
    __privateAdd(this, _staleTimeoutId);
    __privateAdd(this, _refetchIntervalId);
    __privateAdd(this, _currentRefetchInterval);
    __privateAdd(this, _trackedProps, /* @__PURE__ */ new Set());
    this.options = options;
    __privateSet(this, _client, client);
    __privateSet(this, _selectError, null);
    __privateSet(this, _currentThenable, pendingThenable());
    this.bindMethods();
    this.setOptions(options);
  }
  bindMethods() {
    this.refetch = this.refetch.bind(this);
  }
  onSubscribe() {
    if (this.listeners.size === 1) {
      __privateGet(this, _currentQuery).addObserver(this);
      if (shouldFetchOnMount(__privateGet(this, _currentQuery), this.options)) {
        __privateMethod(this, _QueryObserver_instances, executeFetch_fn).call(this);
      } else {
        this.updateResult();
      }
      __privateMethod(this, _QueryObserver_instances, updateTimers_fn).call(this);
    }
  }
  onUnsubscribe() {
    if (!this.hasListeners()) {
      this.destroy();
    }
  }
  shouldFetchOnReconnect() {
    return shouldFetchOn(
      __privateGet(this, _currentQuery),
      this.options,
      this.options.refetchOnReconnect
    );
  }
  shouldFetchOnWindowFocus() {
    return shouldFetchOn(
      __privateGet(this, _currentQuery),
      this.options,
      this.options.refetchOnWindowFocus
    );
  }
  destroy() {
    this.listeners = /* @__PURE__ */ new Set();
    __privateMethod(this, _QueryObserver_instances, clearStaleTimeout_fn).call(this);
    __privateMethod(this, _QueryObserver_instances, clearRefetchInterval_fn).call(this);
    __privateGet(this, _currentQuery).removeObserver(this);
  }
  setOptions(options) {
    const prevOptions = this.options;
    const prevQuery = __privateGet(this, _currentQuery);
    this.options = __privateGet(this, _client).defaultQueryOptions(options);
    if (this.options.enabled !== void 0 && typeof this.options.enabled !== "boolean" && typeof this.options.enabled !== "function" && typeof resolveEnabled(this.options.enabled, __privateGet(this, _currentQuery)) !== "boolean") {
      throw new Error(
        "Expected enabled to be a boolean or a callback that returns a boolean"
      );
    }
    __privateMethod(this, _QueryObserver_instances, updateQuery_fn).call(this);
    __privateGet(this, _currentQuery).setOptions(this.options);
    if (prevOptions._defaulted && !shallowEqualObjects(this.options, prevOptions)) {
      __privateGet(this, _client).getQueryCache().notify({
        type: "observerOptionsUpdated",
        query: __privateGet(this, _currentQuery),
        observer: this
      });
    }
    const mounted = this.hasListeners();
    if (mounted && shouldFetchOptionally(
      __privateGet(this, _currentQuery),
      prevQuery,
      this.options,
      prevOptions
    )) {
      __privateMethod(this, _QueryObserver_instances, executeFetch_fn).call(this);
    }
    this.updateResult();
    if (mounted && (__privateGet(this, _currentQuery) !== prevQuery || resolveEnabled(this.options.enabled, __privateGet(this, _currentQuery)) !== resolveEnabled(prevOptions.enabled, __privateGet(this, _currentQuery)) || resolveStaleTime(this.options.staleTime, __privateGet(this, _currentQuery)) !== resolveStaleTime(prevOptions.staleTime, __privateGet(this, _currentQuery)))) {
      __privateMethod(this, _QueryObserver_instances, updateStaleTimeout_fn).call(this);
    }
    const nextRefetchInterval = __privateMethod(this, _QueryObserver_instances, computeRefetchInterval_fn).call(this);
    if (mounted && (__privateGet(this, _currentQuery) !== prevQuery || resolveEnabled(this.options.enabled, __privateGet(this, _currentQuery)) !== resolveEnabled(prevOptions.enabled, __privateGet(this, _currentQuery)) || nextRefetchInterval !== __privateGet(this, _currentRefetchInterval))) {
      __privateMethod(this, _QueryObserver_instances, updateRefetchInterval_fn).call(this, nextRefetchInterval);
    }
  }
  getOptimisticResult(options) {
    const query = __privateGet(this, _client).getQueryCache().build(__privateGet(this, _client), options);
    const result = this.createResult(query, options);
    if (shouldAssignObserverCurrentProperties(this, result)) {
      __privateSet(this, _currentResult, result);
      __privateSet(this, _currentResultOptions, this.options);
      __privateSet(this, _currentResultState, __privateGet(this, _currentQuery).state);
    }
    return result;
  }
  getCurrentResult() {
    return __privateGet(this, _currentResult);
  }
  trackResult(result, onPropTracked) {
    return new Proxy(result, {
      get: (target, key) => {
        this.trackProp(key);
        onPropTracked == null ? void 0 : onPropTracked(key);
        if (key === "promise") {
          this.trackProp("data");
          if (!this.options.experimental_prefetchInRender && __privateGet(this, _currentThenable).status === "pending") {
            __privateGet(this, _currentThenable).reject(
              new Error(
                "experimental_prefetchInRender feature flag is not enabled"
              )
            );
          }
        }
        return Reflect.get(target, key);
      }
    });
  }
  trackProp(key) {
    __privateGet(this, _trackedProps).add(key);
  }
  getCurrentQuery() {
    return __privateGet(this, _currentQuery);
  }
  refetch({ ...options } = {}) {
    return this.fetch({
      ...options
    });
  }
  fetchOptimistic(options) {
    const defaultedOptions = __privateGet(this, _client).defaultQueryOptions(options);
    const query = __privateGet(this, _client).getQueryCache().build(__privateGet(this, _client), defaultedOptions);
    return query.fetch().then(() => this.createResult(query, defaultedOptions));
  }
  fetch(fetchOptions) {
    return __privateMethod(this, _QueryObserver_instances, executeFetch_fn).call(this, {
      ...fetchOptions,
      cancelRefetch: fetchOptions.cancelRefetch ?? true
    }).then(() => {
      this.updateResult();
      return __privateGet(this, _currentResult);
    });
  }
  createResult(query, options) {
    var _a2;
    const prevQuery = __privateGet(this, _currentQuery);
    const prevOptions = this.options;
    const prevResult = __privateGet(this, _currentResult);
    const prevResultState = __privateGet(this, _currentResultState);
    const prevResultOptions = __privateGet(this, _currentResultOptions);
    const queryChange = query !== prevQuery;
    const queryInitialState = queryChange ? query.state : __privateGet(this, _currentQueryInitialState);
    const { state } = query;
    let newState = { ...state };
    let isPlaceholderData = false;
    let data;
    if (options._optimisticResults) {
      const mounted = this.hasListeners();
      const fetchOnMount = !mounted && shouldFetchOnMount(query, options);
      const fetchOptionally = mounted && shouldFetchOptionally(query, prevQuery, options, prevOptions);
      if (fetchOnMount || fetchOptionally) {
        newState = {
          ...newState,
          ...fetchState(state.data, query.options)
        };
      }
      if (options._optimisticResults === "isRestoring") {
        newState.fetchStatus = "idle";
      }
    }
    let { error, errorUpdatedAt, status } = newState;
    data = newState.data;
    let skipSelect = false;
    if (options.placeholderData !== void 0 && data === void 0 && status === "pending") {
      let placeholderData;
      if ((prevResult == null ? void 0 : prevResult.isPlaceholderData) && options.placeholderData === (prevResultOptions == null ? void 0 : prevResultOptions.placeholderData)) {
        placeholderData = prevResult.data;
        skipSelect = true;
      } else {
        placeholderData = typeof options.placeholderData === "function" ? options.placeholderData(
          (_a2 = __privateGet(this, _lastQueryWithDefinedData)) == null ? void 0 : _a2.state.data,
          __privateGet(this, _lastQueryWithDefinedData)
        ) : options.placeholderData;
      }
      if (placeholderData !== void 0) {
        status = "success";
        data = replaceData(
          prevResult == null ? void 0 : prevResult.data,
          placeholderData,
          options
        );
        isPlaceholderData = true;
      }
    }
    if (options.select && data !== void 0 && !skipSelect) {
      if (prevResult && data === (prevResultState == null ? void 0 : prevResultState.data) && options.select === __privateGet(this, _selectFn)) {
        data = __privateGet(this, _selectResult);
      } else {
        try {
          __privateSet(this, _selectFn, options.select);
          data = options.select(data);
          data = replaceData(prevResult == null ? void 0 : prevResult.data, data, options);
          __privateSet(this, _selectResult, data);
          __privateSet(this, _selectError, null);
        } catch (selectError) {
          __privateSet(this, _selectError, selectError);
        }
      }
    }
    if (__privateGet(this, _selectError)) {
      error = __privateGet(this, _selectError);
      data = __privateGet(this, _selectResult);
      errorUpdatedAt = Date.now();
      status = "error";
    }
    const isFetching = newState.fetchStatus === "fetching";
    const isPending = status === "pending";
    const isError = status === "error";
    const isLoading = isPending && isFetching;
    const hasData = data !== void 0;
    const result = {
      status,
      fetchStatus: newState.fetchStatus,
      isPending,
      isSuccess: status === "success",
      isError,
      isInitialLoading: isLoading,
      isLoading,
      data,
      dataUpdatedAt: newState.dataUpdatedAt,
      error,
      errorUpdatedAt,
      failureCount: newState.fetchFailureCount,
      failureReason: newState.fetchFailureReason,
      errorUpdateCount: newState.errorUpdateCount,
      isFetched: query.isFetched(),
      isFetchedAfterMount: newState.dataUpdateCount > queryInitialState.dataUpdateCount || newState.errorUpdateCount > queryInitialState.errorUpdateCount,
      isFetching,
      isRefetching: isFetching && !isPending,
      isLoadingError: isError && !hasData,
      isPaused: newState.fetchStatus === "paused",
      isPlaceholderData,
      isRefetchError: isError && hasData,
      isStale: isStale(query, options),
      refetch: this.refetch,
      promise: __privateGet(this, _currentThenable),
      isEnabled: resolveEnabled(options.enabled, query) !== false
    };
    const nextResult = result;
    if (this.options.experimental_prefetchInRender) {
      const hasResultData = nextResult.data !== void 0;
      const isErrorWithoutData = nextResult.status === "error" && !hasResultData;
      const finalizeThenableIfPossible = (thenable) => {
        if (isErrorWithoutData) {
          thenable.reject(nextResult.error);
        } else if (hasResultData) {
          thenable.resolve(nextResult.data);
        }
      };
      const recreateThenable = () => {
        const pending = __privateSet(this, _currentThenable, nextResult.promise = pendingThenable());
        finalizeThenableIfPossible(pending);
      };
      const prevThenable = __privateGet(this, _currentThenable);
      switch (prevThenable.status) {
        case "pending":
          if (query.queryHash === prevQuery.queryHash) {
            finalizeThenableIfPossible(prevThenable);
          }
          break;
        case "fulfilled":
          if (isErrorWithoutData || nextResult.data !== prevThenable.value) {
            recreateThenable();
          }
          break;
        case "rejected":
          if (!isErrorWithoutData || nextResult.error !== prevThenable.reason) {
            recreateThenable();
          }
          break;
      }
    }
    return nextResult;
  }
  updateResult() {
    const prevResult = __privateGet(this, _currentResult);
    const nextResult = this.createResult(__privateGet(this, _currentQuery), this.options);
    __privateSet(this, _currentResultState, __privateGet(this, _currentQuery).state);
    __privateSet(this, _currentResultOptions, this.options);
    if (__privateGet(this, _currentResultState).data !== void 0) {
      __privateSet(this, _lastQueryWithDefinedData, __privateGet(this, _currentQuery));
    }
    if (shallowEqualObjects(nextResult, prevResult)) {
      return;
    }
    __privateSet(this, _currentResult, nextResult);
    const shouldNotifyListeners = () => {
      if (!prevResult) {
        return true;
      }
      const { notifyOnChangeProps } = this.options;
      const notifyOnChangePropsValue = typeof notifyOnChangeProps === "function" ? notifyOnChangeProps() : notifyOnChangeProps;
      if (notifyOnChangePropsValue === "all" || !notifyOnChangePropsValue && !__privateGet(this, _trackedProps).size) {
        return true;
      }
      const includedProps = new Set(
        notifyOnChangePropsValue ?? __privateGet(this, _trackedProps)
      );
      if (this.options.throwOnError) {
        includedProps.add("error");
      }
      return Object.keys(__privateGet(this, _currentResult)).some((key) => {
        const typedKey = key;
        const changed = __privateGet(this, _currentResult)[typedKey] !== prevResult[typedKey];
        return changed && includedProps.has(typedKey);
      });
    };
    __privateMethod(this, _QueryObserver_instances, notify_fn).call(this, { listeners: shouldNotifyListeners() });
  }
  onQueryUpdate() {
    this.updateResult();
    if (this.hasListeners()) {
      __privateMethod(this, _QueryObserver_instances, updateTimers_fn).call(this);
    }
  }
}, _client = new WeakMap(), _currentQuery = new WeakMap(), _currentQueryInitialState = new WeakMap(), _currentResult = new WeakMap(), _currentResultState = new WeakMap(), _currentResultOptions = new WeakMap(), _currentThenable = new WeakMap(), _selectError = new WeakMap(), _selectFn = new WeakMap(), _selectResult = new WeakMap(), _lastQueryWithDefinedData = new WeakMap(), _staleTimeoutId = new WeakMap(), _refetchIntervalId = new WeakMap(), _currentRefetchInterval = new WeakMap(), _trackedProps = new WeakMap(), _QueryObserver_instances = new WeakSet(), executeFetch_fn = function(fetchOptions) {
  __privateMethod(this, _QueryObserver_instances, updateQuery_fn).call(this);
  let promise = __privateGet(this, _currentQuery).fetch(
    this.options,
    fetchOptions
  );
  if (!(fetchOptions == null ? void 0 : fetchOptions.throwOnError)) {
    promise = promise.catch(noop);
  }
  return promise;
}, updateStaleTimeout_fn = function() {
  __privateMethod(this, _QueryObserver_instances, clearStaleTimeout_fn).call(this);
  const staleTime = resolveStaleTime(
    this.options.staleTime,
    __privateGet(this, _currentQuery)
  );
  if (environmentManager.isServer() || __privateGet(this, _currentResult).isStale || !isValidTimeout(staleTime)) {
    return;
  }
  const time = timeUntilStale(__privateGet(this, _currentResult).dataUpdatedAt, staleTime);
  const timeout2 = time + 1;
  __privateSet(this, _staleTimeoutId, timeoutManager.setTimeout(() => {
    if (!__privateGet(this, _currentResult).isStale) {
      this.updateResult();
    }
  }, timeout2));
}, computeRefetchInterval_fn = function() {
  return (typeof this.options.refetchInterval === "function" ? this.options.refetchInterval(__privateGet(this, _currentQuery)) : this.options.refetchInterval) ?? false;
}, updateRefetchInterval_fn = function(nextInterval) {
  __privateMethod(this, _QueryObserver_instances, clearRefetchInterval_fn).call(this);
  __privateSet(this, _currentRefetchInterval, nextInterval);
  if (environmentManager.isServer() || resolveEnabled(this.options.enabled, __privateGet(this, _currentQuery)) === false || !isValidTimeout(__privateGet(this, _currentRefetchInterval)) || __privateGet(this, _currentRefetchInterval) === 0) {
    return;
  }
  __privateSet(this, _refetchIntervalId, timeoutManager.setInterval(() => {
    if (this.options.refetchIntervalInBackground || focusManager.isFocused()) {
      __privateMethod(this, _QueryObserver_instances, executeFetch_fn).call(this);
    }
  }, __privateGet(this, _currentRefetchInterval)));
}, updateTimers_fn = function() {
  __privateMethod(this, _QueryObserver_instances, updateStaleTimeout_fn).call(this);
  __privateMethod(this, _QueryObserver_instances, updateRefetchInterval_fn).call(this, __privateMethod(this, _QueryObserver_instances, computeRefetchInterval_fn).call(this));
}, clearStaleTimeout_fn = function() {
  if (__privateGet(this, _staleTimeoutId)) {
    timeoutManager.clearTimeout(__privateGet(this, _staleTimeoutId));
    __privateSet(this, _staleTimeoutId, void 0);
  }
}, clearRefetchInterval_fn = function() {
  if (__privateGet(this, _refetchIntervalId)) {
    timeoutManager.clearInterval(__privateGet(this, _refetchIntervalId));
    __privateSet(this, _refetchIntervalId, void 0);
  }
}, updateQuery_fn = function() {
  const query = __privateGet(this, _client).getQueryCache().build(__privateGet(this, _client), this.options);
  if (query === __privateGet(this, _currentQuery)) {
    return;
  }
  const prevQuery = __privateGet(this, _currentQuery);
  __privateSet(this, _currentQuery, query);
  __privateSet(this, _currentQueryInitialState, query.state);
  if (this.hasListeners()) {
    prevQuery == null ? void 0 : prevQuery.removeObserver(this);
    query.addObserver(this);
  }
}, notify_fn = function(notifyOptions) {
  notifyManager.batch(() => {
    if (notifyOptions.listeners) {
      this.listeners.forEach((listener) => {
        listener(__privateGet(this, _currentResult));
      });
    }
    __privateGet(this, _client).getQueryCache().notify({
      query: __privateGet(this, _currentQuery),
      type: "observerResultsUpdated"
    });
  });
}, _a);
function shouldLoadOnMount(query, options) {
  return resolveEnabled(options.enabled, query) !== false && query.state.data === void 0 && !(query.state.status === "error" && options.retryOnMount === false);
}
function shouldFetchOnMount(query, options) {
  return shouldLoadOnMount(query, options) || query.state.data !== void 0 && shouldFetchOn(query, options, options.refetchOnMount);
}
function shouldFetchOn(query, options, field) {
  if (resolveEnabled(options.enabled, query) !== false && resolveStaleTime(options.staleTime, query) !== "static") {
    const value = typeof field === "function" ? field(query) : field;
    return value === "always" || value !== false && isStale(query, options);
  }
  return false;
}
function shouldFetchOptionally(query, prevQuery, options, prevOptions) {
  return (query !== prevQuery || resolveEnabled(prevOptions.enabled, query) === false) && (!options.suspense || query.state.status !== "error") && isStale(query, options);
}
function isStale(query, options) {
  return resolveEnabled(options.enabled, query) !== false && query.isStaleByTime(resolveStaleTime(options.staleTime, query));
}
function shouldAssignObserverCurrentProperties(observer, optimisticResult) {
  if (!shallowEqualObjects(observer.getCurrentResult(), optimisticResult)) {
    return true;
  }
  return false;
}
var MutationObserver = (_b = class extends Subscribable {
  constructor(client, options) {
    super();
    __privateAdd(this, _MutationObserver_instances);
    __privateAdd(this, _client2);
    __privateAdd(this, _currentResult2);
    __privateAdd(this, _currentMutation);
    __privateAdd(this, _mutateOptions);
    __privateSet(this, _client2, client);
    this.setOptions(options);
    this.bindMethods();
    __privateMethod(this, _MutationObserver_instances, updateResult_fn).call(this);
  }
  bindMethods() {
    this.mutate = this.mutate.bind(this);
    this.reset = this.reset.bind(this);
  }
  setOptions(options) {
    var _a2;
    const prevOptions = this.options;
    this.options = __privateGet(this, _client2).defaultMutationOptions(options);
    if (!shallowEqualObjects(this.options, prevOptions)) {
      __privateGet(this, _client2).getMutationCache().notify({
        type: "observerOptionsUpdated",
        mutation: __privateGet(this, _currentMutation),
        observer: this
      });
    }
    if ((prevOptions == null ? void 0 : prevOptions.mutationKey) && this.options.mutationKey && hashKey(prevOptions.mutationKey) !== hashKey(this.options.mutationKey)) {
      this.reset();
    } else if (((_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.state.status) === "pending") {
      __privateGet(this, _currentMutation).setOptions(this.options);
    }
  }
  onUnsubscribe() {
    var _a2;
    if (!this.hasListeners()) {
      (_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.removeObserver(this);
    }
  }
  onMutationUpdate(action) {
    __privateMethod(this, _MutationObserver_instances, updateResult_fn).call(this);
    __privateMethod(this, _MutationObserver_instances, notify_fn2).call(this, action);
  }
  getCurrentResult() {
    return __privateGet(this, _currentResult2);
  }
  reset() {
    var _a2;
    (_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.removeObserver(this);
    __privateSet(this, _currentMutation, void 0);
    __privateMethod(this, _MutationObserver_instances, updateResult_fn).call(this);
    __privateMethod(this, _MutationObserver_instances, notify_fn2).call(this);
  }
  mutate(variables, options) {
    var _a2;
    __privateSet(this, _mutateOptions, options);
    (_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.removeObserver(this);
    __privateSet(this, _currentMutation, __privateGet(this, _client2).getMutationCache().build(__privateGet(this, _client2), this.options));
    __privateGet(this, _currentMutation).addObserver(this);
    return __privateGet(this, _currentMutation).execute(variables);
  }
}, _client2 = new WeakMap(), _currentResult2 = new WeakMap(), _currentMutation = new WeakMap(), _mutateOptions = new WeakMap(), _MutationObserver_instances = new WeakSet(), updateResult_fn = function() {
  var _a2;
  const state = ((_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.state) ?? getDefaultState();
  __privateSet(this, _currentResult2, {
    ...state,
    isPending: state.status === "pending",
    isSuccess: state.status === "success",
    isError: state.status === "error",
    isIdle: state.status === "idle",
    mutate: this.mutate,
    reset: this.reset
  });
}, notify_fn2 = function(action) {
  notifyManager.batch(() => {
    var _a2, _b2, _c, _d, _e, _f, _g, _h;
    if (__privateGet(this, _mutateOptions) && this.hasListeners()) {
      const variables = __privateGet(this, _currentResult2).variables;
      const onMutateResult = __privateGet(this, _currentResult2).context;
      const context = {
        client: __privateGet(this, _client2),
        meta: this.options.meta,
        mutationKey: this.options.mutationKey
      };
      if ((action == null ? void 0 : action.type) === "success") {
        try {
          (_b2 = (_a2 = __privateGet(this, _mutateOptions)).onSuccess) == null ? void 0 : _b2.call(
            _a2,
            action.data,
            variables,
            onMutateResult,
            context
          );
        } catch (e) {
          void Promise.reject(e);
        }
        try {
          (_d = (_c = __privateGet(this, _mutateOptions)).onSettled) == null ? void 0 : _d.call(
            _c,
            action.data,
            null,
            variables,
            onMutateResult,
            context
          );
        } catch (e) {
          void Promise.reject(e);
        }
      } else if ((action == null ? void 0 : action.type) === "error") {
        try {
          (_f = (_e = __privateGet(this, _mutateOptions)).onError) == null ? void 0 : _f.call(
            _e,
            action.error,
            variables,
            onMutateResult,
            context
          );
        } catch (e) {
          void Promise.reject(e);
        }
        try {
          (_h = (_g = __privateGet(this, _mutateOptions)).onSettled) == null ? void 0 : _h.call(
            _g,
            void 0,
            action.error,
            variables,
            onMutateResult,
            context
          );
        } catch (e) {
          void Promise.reject(e);
        }
      }
    }
    this.listeners.forEach((listener) => {
      listener(__privateGet(this, _currentResult2));
    });
  });
}, _b);
var IsRestoringContext = reactExports.createContext(false);
var useIsRestoring = () => reactExports.useContext(IsRestoringContext);
IsRestoringContext.Provider;
function createValue() {
  let isReset = false;
  return {
    clearReset: () => {
      isReset = false;
    },
    reset: () => {
      isReset = true;
    },
    isReset: () => {
      return isReset;
    }
  };
}
var QueryErrorResetBoundaryContext = reactExports.createContext(createValue());
var useQueryErrorResetBoundary = () => reactExports.useContext(QueryErrorResetBoundaryContext);
var ensurePreventErrorBoundaryRetry = (options, errorResetBoundary, query) => {
  const throwOnError = (query == null ? void 0 : query.state.error) && typeof options.throwOnError === "function" ? shouldThrowError(options.throwOnError, [query.state.error, query]) : options.throwOnError;
  if (options.suspense || options.experimental_prefetchInRender || throwOnError) {
    if (!errorResetBoundary.isReset()) {
      options.retryOnMount = false;
    }
  }
};
var useClearResetErrorBoundary = (errorResetBoundary) => {
  reactExports.useEffect(() => {
    errorResetBoundary.clearReset();
  }, [errorResetBoundary]);
};
var getHasError = ({
  result,
  errorResetBoundary,
  throwOnError,
  query,
  suspense
}) => {
  return result.isError && !errorResetBoundary.isReset() && !result.isFetching && query && (suspense && result.data === void 0 || shouldThrowError(throwOnError, [result.error, query]));
};
var ensureSuspenseTimers = (defaultedOptions) => {
  if (defaultedOptions.suspense) {
    const MIN_SUSPENSE_TIME_MS = 1e3;
    const clamp = (value) => value === "static" ? value : Math.max(value ?? MIN_SUSPENSE_TIME_MS, MIN_SUSPENSE_TIME_MS);
    const originalStaleTime = defaultedOptions.staleTime;
    defaultedOptions.staleTime = typeof originalStaleTime === "function" ? (...args) => clamp(originalStaleTime(...args)) : clamp(originalStaleTime);
    if (typeof defaultedOptions.gcTime === "number") {
      defaultedOptions.gcTime = Math.max(
        defaultedOptions.gcTime,
        MIN_SUSPENSE_TIME_MS
      );
    }
  }
};
var willFetch = (result, isRestoring) => result.isLoading && result.isFetching && !isRestoring;
var shouldSuspend = (defaultedOptions, result) => (defaultedOptions == null ? void 0 : defaultedOptions.suspense) && result.isPending;
var fetchOptimistic = (defaultedOptions, observer, errorResetBoundary) => observer.fetchOptimistic(defaultedOptions).catch(() => {
  errorResetBoundary.clearReset();
});
function useBaseQuery(options, Observer, queryClient) {
  var _a2, _b2, _c, _d;
  const isRestoring = useIsRestoring();
  const errorResetBoundary = useQueryErrorResetBoundary();
  const client = useQueryClient();
  const defaultedOptions = client.defaultQueryOptions(options);
  (_b2 = (_a2 = client.getDefaultOptions().queries) == null ? void 0 : _a2._experimental_beforeQuery) == null ? void 0 : _b2.call(
    _a2,
    defaultedOptions
  );
  const query = client.getQueryCache().get(defaultedOptions.queryHash);
  defaultedOptions._optimisticResults = isRestoring ? "isRestoring" : "optimistic";
  ensureSuspenseTimers(defaultedOptions);
  ensurePreventErrorBoundaryRetry(defaultedOptions, errorResetBoundary, query);
  useClearResetErrorBoundary(errorResetBoundary);
  const isNewCacheEntry = !client.getQueryCache().get(defaultedOptions.queryHash);
  const [observer] = reactExports.useState(
    () => new Observer(
      client,
      defaultedOptions
    )
  );
  const result = observer.getOptimisticResult(defaultedOptions);
  const shouldSubscribe = !isRestoring && options.subscribed !== false;
  reactExports.useSyncExternalStore(
    reactExports.useCallback(
      (onStoreChange) => {
        const unsubscribe = shouldSubscribe ? observer.subscribe(notifyManager.batchCalls(onStoreChange)) : noop;
        observer.updateResult();
        return unsubscribe;
      },
      [observer, shouldSubscribe]
    ),
    () => observer.getCurrentResult(),
    () => observer.getCurrentResult()
  );
  reactExports.useEffect(() => {
    observer.setOptions(defaultedOptions);
  }, [defaultedOptions, observer]);
  if (shouldSuspend(defaultedOptions, result)) {
    throw fetchOptimistic(defaultedOptions, observer, errorResetBoundary);
  }
  if (getHasError({
    result,
    errorResetBoundary,
    throwOnError: defaultedOptions.throwOnError,
    query,
    suspense: defaultedOptions.suspense
  })) {
    throw result.error;
  }
  (_d = (_c = client.getDefaultOptions().queries) == null ? void 0 : _c._experimental_afterQuery) == null ? void 0 : _d.call(
    _c,
    defaultedOptions,
    result
  );
  if (defaultedOptions.experimental_prefetchInRender && !environmentManager.isServer() && willFetch(result, isRestoring)) {
    const promise = isNewCacheEntry ? (
      // Fetch immediately on render in order to ensure `.promise` is resolved even if the component is unmounted
      fetchOptimistic(defaultedOptions, observer, errorResetBoundary)
    ) : (
      // subscribe to the "cache promise" so that we can finalize the currentThenable once data comes in
      query == null ? void 0 : query.promise
    );
    promise == null ? void 0 : promise.catch(noop).finally(() => {
      observer.updateResult();
    });
  }
  return !defaultedOptions.notifyOnChangeProps ? observer.trackResult(result) : result;
}
function useQuery(options, queryClient) {
  return useBaseQuery(options, QueryObserver);
}
function useMutation(options, queryClient) {
  const client = useQueryClient();
  const [observer] = reactExports.useState(
    () => new MutationObserver(
      client,
      options
    )
  );
  reactExports.useEffect(() => {
    observer.setOptions(options);
  }, [observer, options]);
  const result = reactExports.useSyncExternalStore(
    reactExports.useCallback(
      (onStoreChange) => observer.subscribe(notifyManager.batchCalls(onStoreChange)),
      [observer]
    ),
    () => observer.getCurrentResult(),
    () => observer.getCurrentResult()
  );
  const mutate = reactExports.useCallback(
    (variables, mutateOptions) => {
      observer.mutate(variables, mutateOptions).catch(noop);
    },
    [observer]
  );
  if (result.error && shouldThrowError(observer.options.throwOnError, [result.error])) {
    throw result.error;
  }
  return { ...result, mutate, mutateAsync: result.mutate };
}
function hasAccessControl(actor) {
  return typeof actor === "object" && actor !== null && "_initializeAccessControl" in actor;
}
const ACTOR_QUERY_KEY = "actor";
function useActor(createActor2) {
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const actorQuery = useQuery({
    queryKey: [ACTOR_QUERY_KEY, identity == null ? void 0 : identity.getPrincipal().toString()],
    queryFn: async () => {
      const isAuthenticated = !!identity;
      if (!isAuthenticated) {
        return await createActorWithConfig(createActor2);
      }
      const actorOptions = {
        agentOptions: {
          identity
        }
      };
      const actor = await createActorWithConfig(createActor2, actorOptions);
      if (hasAccessControl(actor)) {
        await actor._initializeAccessControl();
      }
      return actor;
    },
    // Only refetch when identity changes
    staleTime: Number.POSITIVE_INFINITY,
    // This will cause the actor to be recreated when the identity changes
    enabled: true
  });
  reactExports.useEffect(() => {
    if (actorQuery.data) {
      queryClient.invalidateQueries({
        predicate: (query) => {
          return !query.queryKey.includes(ACTOR_QUERY_KEY);
        }
      });
      queryClient.refetchQueries({
        predicate: (query) => {
          return !query.queryKey.includes(ACTOR_QUERY_KEY);
        }
      });
    }
  }, [actorQuery.data, queryClient]);
  return {
    actor: actorQuery.data || null,
    isFetching: actorQuery.isFetching
  };
}
function setRef(ref, value) {
  if (typeof ref === "function") {
    return ref(value);
  } else if (ref !== null && ref !== void 0) {
    ref.current = value;
  }
}
function composeRefs(...refs) {
  return (node) => {
    let hasCleanup = false;
    const cleanups = refs.map((ref) => {
      const cleanup = setRef(ref, node);
      if (!hasCleanup && typeof cleanup == "function") {
        hasCleanup = true;
      }
      return cleanup;
    });
    if (hasCleanup) {
      return () => {
        for (let i = 0; i < cleanups.length; i++) {
          const cleanup = cleanups[i];
          if (typeof cleanup == "function") {
            cleanup();
          } else {
            setRef(refs[i], null);
          }
        }
      };
    }
  };
}
function useComposedRefs(...refs) {
  return reactExports.useCallback(composeRefs(...refs), refs);
}
var REACT_LAZY_TYPE = Symbol.for("react.lazy");
var use = React[" use ".trim().toString()];
function isPromiseLike(value) {
  return typeof value === "object" && value !== null && "then" in value;
}
function isLazyComponent(element) {
  return element != null && typeof element === "object" && "$$typeof" in element && element.$$typeof === REACT_LAZY_TYPE && "_payload" in element && isPromiseLike(element._payload);
}
// @__NO_SIDE_EFFECTS__
function createSlot(ownerName) {
  const SlotClone = /* @__PURE__ */ createSlotClone(ownerName);
  const Slot2 = reactExports.forwardRef((props, forwardedRef) => {
    let { children, ...slotProps } = props;
    if (isLazyComponent(children) && typeof use === "function") {
      children = use(children._payload);
    }
    const childrenArray = reactExports.Children.toArray(children);
    const slottable = childrenArray.find(isSlottable);
    if (slottable) {
      const newElement = slottable.props.children;
      const newChildren = childrenArray.map((child) => {
        if (child === slottable) {
          if (reactExports.Children.count(newElement) > 1) return reactExports.Children.only(null);
          return reactExports.isValidElement(newElement) ? newElement.props.children : null;
        } else {
          return child;
        }
      });
      return /* @__PURE__ */ jsxRuntimeExports.jsx(SlotClone, { ...slotProps, ref: forwardedRef, children: reactExports.isValidElement(newElement) ? reactExports.cloneElement(newElement, void 0, newChildren) : null });
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(SlotClone, { ...slotProps, ref: forwardedRef, children });
  });
  Slot2.displayName = `${ownerName}.Slot`;
  return Slot2;
}
var Slot = /* @__PURE__ */ createSlot("Slot");
// @__NO_SIDE_EFFECTS__
function createSlotClone(ownerName) {
  const SlotClone = reactExports.forwardRef((props, forwardedRef) => {
    let { children, ...slotProps } = props;
    if (isLazyComponent(children) && typeof use === "function") {
      children = use(children._payload);
    }
    if (reactExports.isValidElement(children)) {
      const childrenRef = getElementRef(children);
      const props2 = mergeProps(slotProps, children.props);
      if (children.type !== reactExports.Fragment) {
        props2.ref = forwardedRef ? composeRefs(forwardedRef, childrenRef) : childrenRef;
      }
      return reactExports.cloneElement(children, props2);
    }
    return reactExports.Children.count(children) > 1 ? reactExports.Children.only(null) : null;
  });
  SlotClone.displayName = `${ownerName}.SlotClone`;
  return SlotClone;
}
var SLOTTABLE_IDENTIFIER = Symbol("radix.slottable");
function isSlottable(child) {
  return reactExports.isValidElement(child) && typeof child.type === "function" && "__radixId" in child.type && child.type.__radixId === SLOTTABLE_IDENTIFIER;
}
function mergeProps(slotProps, childProps) {
  const overrideProps = { ...childProps };
  for (const propName in childProps) {
    const slotPropValue = slotProps[propName];
    const childPropValue = childProps[propName];
    const isHandler = /^on[A-Z]/.test(propName);
    if (isHandler) {
      if (slotPropValue && childPropValue) {
        overrideProps[propName] = (...args) => {
          const result = childPropValue(...args);
          slotPropValue(...args);
          return result;
        };
      } else if (slotPropValue) {
        overrideProps[propName] = slotPropValue;
      }
    } else if (propName === "style") {
      overrideProps[propName] = { ...slotPropValue, ...childPropValue };
    } else if (propName === "className") {
      overrideProps[propName] = [slotPropValue, childPropValue].filter(Boolean).join(" ");
    }
  }
  return { ...slotProps, ...overrideProps };
}
function getElementRef(element) {
  var _a2, _b2;
  let getter = (_a2 = Object.getOwnPropertyDescriptor(element.props, "ref")) == null ? void 0 : _a2.get;
  let mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
  if (mayWarn) {
    return element.ref;
  }
  getter = (_b2 = Object.getOwnPropertyDescriptor(element, "ref")) == null ? void 0 : _b2.get;
  mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
  if (mayWarn) {
    return element.props.ref;
  }
  return element.props.ref || element.ref;
}
var NODES = [
  "a",
  "button",
  "div",
  "form",
  "h2",
  "h3",
  "img",
  "input",
  "label",
  "li",
  "nav",
  "ol",
  "p",
  "select",
  "span",
  "svg",
  "ul"
];
var Primitive = NODES.reduce((primitive, node) => {
  const Slot2 = /* @__PURE__ */ createSlot(`Primitive.${node}`);
  const Node = reactExports.forwardRef((props, forwardedRef) => {
    const { asChild, ...primitiveProps } = props;
    const Comp = asChild ? Slot2 : node;
    if (typeof window !== "undefined") {
      window[Symbol.for("radix-ui")] = true;
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Comp, { ...primitiveProps, ref: forwardedRef });
  });
  Node.displayName = `Primitive.${node}`;
  return { ...primitive, [node]: Node };
}, {});
const PostId = Nat;
const CommentId = Nat;
const UserId = Principal$1;
const GroupId = Nat;
const Timestamp = Int;
const GroupView = Record({
  "id": GroupId,
  "coverImageData": Opt(Text),
  "ownerId": UserId,
  "name": Text,
  "createdAt": Timestamp,
  "memberCount": Nat,
  "isMember": Bool,
  "description": Text,
  "isPrivate": Bool,
  "hasCoverImage": Bool,
  "ownerUsername": Text
});
const CreateGroupResult = Variant({
  "ok": GroupView,
  "err": Text
});
const Visibility$1 = Variant({
  "everyone": Null,
  "followersOnly": Null,
  "friendsOnly": Null,
  "customList": Null
});
const StoryId = Nat;
const UserProfile = Record({
  "id": UserId,
  "bio": Text,
  "postCount": Nat,
  "username": Text,
  "aboutWebsite": Opt(Text),
  "birthdate": Opt(Text),
  "isOfficialPage": Bool,
  "isVerified": Bool,
  "aboutBio": Opt(Text),
  "aboutWork": Opt(Text),
  "aboutLocation": Opt(Text),
  "followerCount": Nat,
  "followingCount": Nat,
  "profilePhotoUrl": Opt(Text),
  "visibility": Visibility$1,
  "coverPhotoUrl": Opt(Text),
  "aboutEducation": Opt(Text)
});
const StoryView = Record({
  "id": StoryId,
  "expiresAt": Timestamp,
  "viewedByMe": Bool,
  "createdAt": Timestamp,
  "author": UserProfile,
  "imageUrl": Text,
  "textOverlay": Opt(Text),
  "viewCount": Nat
});
const AdminStats = Record({
  "pendingReports": Nat,
  "totalMessages": Nat,
  "verifiedUsers": Nat,
  "totalUsers": Nat,
  "totalPosts": Nat,
  "totalStories": Nat
});
const CommentView = Record({
  "id": CommentId,
  "content": Text,
  "authorId": UserId,
  "createdAt": Timestamp,
  "authorName": Text,
  "updatedAt": Timestamp,
  "replyCount": Nat,
  "parentId": Opt(CommentId),
  "postId": PostId
});
const ConversationId = Text;
const ConversationSummary = Record({
  "lastMessageAt": Timestamp,
  "otherUsername": Text,
  "lastMessagePreview": Text,
  "otherUserId": UserId,
  "conversationId": ConversationId
});
const PostView = Record({
  "id": PostId,
  "authorVerified": Bool,
  "content": Text,
  "authorProfilePhoto": Opt(Text),
  "authorId": UserId,
  "createdAt": Timestamp,
  "authorName": Text,
  "updatedAt": Timestamp,
  "imageUrl": Opt(Text),
  "visibility": Visibility$1,
  "isPinned": Bool
});
const MessageId = Nat;
const MessageReactionView = Record({
  "reactor": UserProfile,
  "reaction": Text
});
const MessageView = Record({
  "id": MessageId,
  "encryptedContent": Vec(Nat8),
  "createdAt": Timestamp,
  "isRead": Bool,
  "conversationId": ConversationId,
  "senderId": UserId,
  "readAt": Opt(Timestamp)
});
const ReactionType$1 = Variant({
  "sad": Null,
  "wow": Null,
  "angry": Null,
  "haha": Null,
  "like": Null,
  "love": Null
});
const NotificationId = Nat;
const NotificationType = Variant({
  "verified": Record({}),
  "like": Record({ "postId": PostId }),
  "share": Record({ "postId": PostId }),
  "comment": Record({ "commentId": CommentId, "postId": PostId }),
  "mention": Record({ "postId": PostId }),
  "friendRequest": Record({ "requestId": Nat }),
  "reaction": Record({ "reaction": ReactionType$1, "postId": PostId }),
  "follow": Record({})
});
const NotificationView = Record({
  "id": NotificationId,
  "actorName": Text,
  "notifType": NotificationType,
  "createdAt": Timestamp,
  "isRead": Bool,
  "actorId": UserId
});
const FriendRequestId = Nat;
const FriendRequestView = Record({
  "id": FriendRequestId,
  "to": UserProfile,
  "status": Text,
  "from": UserProfile,
  "createdAt": Timestamp
});
const PollOptionResult = Record({
  "id": Nat,
  "votes": Nat,
  "text": Text,
  "percent": Float64
});
const PollResults = Record({
  "totalVotes": Nat,
  "myVote": Opt(Nat),
  "options": Vec(PollOptionResult)
});
const PostStats = Record({
  "shares": Nat,
  "likes": Nat,
  "comments": Nat
});
const ReportView = Record({
  "id": Nat,
  "status": Text,
  "reportedPost": Opt(PostView),
  "reportedUser": Opt(UserProfile),
  "createdAt": Timestamp,
  "reporter": UserProfile,
  "reason": Text
});
const StoryFeed = Record({
  "stories": Vec(StoryView),
  "author": UserProfile,
  "hasUnviewed": Bool
});
const HashtagStat = Record({
  "postCount": Nat,
  "hashtag": Text
});
const JoinLeaveGroupResult = Variant({
  "ok": Bool,
  "err": Text
});
const LoginWithPasswordResult = Variant({
  "ok": Record({ "userId": UserId, "profile": UserProfile }),
  "err": Text
});
const ResolveAction$1 = Variant({
  "banUser": Null,
  "deleteContent": Null,
  "dismiss": Null,
  "suspendUser": Null
});
const RespondAction$1 = Variant({
  "accept": Null,
  "block": Null,
  "decline": Null
});
const SearchResults = Record({
  "users": Vec(UserProfile),
  "posts": Vec(PostView)
});
Service({
  "addComment": Func([PostId, Text], [CommentId], []),
  "banUser": Func([UserId], [Bool], []),
  "blockUser": Func([UserId], [], []),
  "cancelFriendRequest": Func([Nat], [Bool], []),
  "createGroup": Func(
    [Text, Text, Bool, Opt(Text)],
    [CreateGroupResult],
    []
  ),
  "createOfficialPost": Func(
    [Text, Opt(Text)],
    [Variant({ "ok": PostId, "err": Text })],
    []
  ),
  "createPoll": Func([PostId, Text, Vec(Text)], [Nat], []),
  "createPost": Func(
    [Text, Visibility$1, Vec(UserId), Opt(Text)],
    [Variant({ "ok": PostId, "err": Text })],
    []
  ),
  "createStory": Func([Text, Opt(Text)], [StoryView], []),
  "deleteComment": Func([CommentId], [], []),
  "deleteGroup": Func([GroupId], [Bool], []),
  "deletePost": Func([PostId], [Bool], []),
  "deleteStory": Func([Nat], [], []),
  "editComment": Func([CommentId, Text], [], []),
  "editPost": Func([PostId, Text], [Bool], []),
  "followUser": Func([UserId], [Bool], []),
  "getAdminStats": Func([], [AdminStats], ["query"]),
  "getAllUsers": Func(
    [Nat, Nat],
    [Vec(UserProfile)],
    ["query"]
  ),
  "getComments": Func([PostId], [Vec(CommentView)], ["query"]),
  "getConversations": Func([], [Vec(ConversationSummary)], ["query"]),
  "getFeed": Func([], [Vec(PostView)], ["query"]),
  "getFriendRequestStatus": Func([UserId], [Text], ["query"]),
  "getGroup": Func([GroupId], [Opt(GroupView)], ["query"]),
  "getGroups": Func([], [Vec(GroupView)], ["query"]),
  "getHashtagPosts": Func([Text], [Vec(PostView)], ["query"]),
  "getLikes": Func([PostId], [Vec(UserId)], ["query"]),
  "getMessageReactions": Func(
    [MessageId],
    [Vec(MessageReactionView)],
    ["query"]
  ),
  "getMessages": Func([UserId], [Vec(MessageView)], ["query"]),
  "getMyEmail": Func([], [Opt(Text)], ["query"]),
  "getMyGroups": Func([], [Vec(GroupView)], ["query"]),
  "getMyProfile": Func([], [Opt(UserProfile)], ["query"]),
  "getMyReaction": Func([PostId], [Opt(ReactionType$1)], []),
  "getMyStories": Func([], [Vec(StoryView)], ["query"]),
  "getNotifications": Func([], [Vec(NotificationView)], []),
  "getOfficialPage": Func([], [UserProfile], ["query"]),
  "getOfficialPageLink": Func([], [Text], ["query"]),
  "getOfficialPagePosts": Func(
    [Nat, Nat],
    [Vec(PostView)],
    ["query"]
  ),
  "getPendingRequests": Func([], [Vec(FriendRequestView)], ["query"]),
  "getPollResults": Func([Nat], [PollResults], ["query"]),
  "getPostStats": Func([PostId], [PostStats], ["query"]),
  "getProfileLink": Func([UserId], [Text], ["query"]),
  "getReactions": Func(
    [PostId],
    [Vec(Tuple(ReactionType$1, Nat))],
    ["query"]
  ),
  "getReports": Func([Nat, Nat], [Vec(ReportView)], ["query"]),
  "getSavedPosts": Func([], [Vec(PostView)], []),
  "getSentRequests": Func([], [Vec(FriendRequestView)], ["query"]),
  "getShares": Func([PostId], [Nat], ["query"]),
  "getStoriesFeed": Func([], [Vec(StoryFeed)], ["query"]),
  "getStoryViewers": Func([Nat], [Vec(UserProfile)], ["query"]),
  "getTrendingHashtags": Func([], [Vec(HashtagStat)], ["query"]),
  "getUnreadCount": Func([], [Nat], []),
  "getUserPosts": Func([UserId], [Vec(PostView)], ["query"]),
  "getUserProfile": Func([UserId], [Opt(UserProfile)], ["query"]),
  "grantVerification": Func([UserId], [Bool], []),
  "hasLiked": Func([PostId], [Bool], []),
  "inviteMember": Func([GroupId, Text], [JoinLeaveGroupResult], []),
  "isBlocked": Func([UserId], [Bool], ["query"]),
  "isFollowing": Func([UserId], [Bool], ["query"]),
  "isVerified": Func([UserId], [Bool], ["query"]),
  "joinGroup": Func([GroupId], [JoinLeaveGroupResult], []),
  "leaveGroup": Func([GroupId], [JoinLeaveGroupResult], []),
  "likePost": Func([PostId], [], []),
  "loginWithPassword": Func(
    [Text, Text],
    [Variant({ "ok": UserProfile, "err": Text })],
    []
  ),
  "loginWithPasswordOnly": Func(
    [Text, Text],
    [LoginWithPasswordResult],
    []
  ),
  "markMessageRead": Func([MessageId], [], []),
  "markNotificationsRead": Func([], [], []),
  "pinPost": Func([PostId], [Bool], []),
  "reactToMessage": Func([MessageId, ReactionType$1], [Bool], []),
  "reactToPost": Func([PostId, ReactionType$1], [], []),
  "register": Func([Text, Text], [Bool], []),
  "registerWithPassword": Func(
    [Text, Text, Text, Opt(Text)],
    [Variant({ "ok": Bool, "err": Text })],
    []
  ),
  "removeMessageReaction": Func([MessageId], [Bool], []),
  "removeReaction": Func([PostId], [], []),
  "replyToComment": Func([CommentId, Text], [CommentId], []),
  "reportPost": Func([PostId, Text], [], []),
  "reportUser": Func([UserId, Text], [], []),
  "resolveReport": Func([Nat, ResolveAction$1], [Bool], []),
  "respondFriendRequest": Func([Nat, RespondAction$1], [Bool], []),
  "revokeVerification": Func([UserId], [Bool], []),
  "savePost": Func([PostId], [], []),
  "searchContent": Func([Text], [SearchResults], ["query"]),
  "searchUsers": Func([Text], [Vec(UserProfile)], ["query"]),
  "sendFriendRequest": Func([UserId], [Bool], []),
  "sendMessage": Func([UserId, Vec(Nat8)], [MessageId], []),
  "setMyPassword": Func(
    [Text],
    [Variant({ "ok": Bool, "err": Text })],
    []
  ),
  "sharePost": Func([PostId], [], []),
  "suspendUser": Func([UserId, Nat], [Bool], []),
  "unblockUser": Func([UserId], [], []),
  "unfollowUser": Func([UserId], [Bool], []),
  "unlikePost": Func([PostId], [], []),
  "unpinPost": Func([], [Bool], []),
  "unsavePost": Func([PostId], [], []),
  "unsharePost": Func([PostId], [], []),
  "updateAbout": Func(
    [
      Opt(Text),
      Opt(Text),
      Opt(Text),
      Opt(Text),
      Opt(Text)
    ],
    [Bool],
    []
  ),
  "updateCoverPhoto": Func(
    [Text],
    [Variant({ "ok": Null, "err": Text })],
    []
  ),
  "updateEmail": Func([Text], [Bool], []),
  "updateOfficialPageCoverPhoto": Func(
    [Text],
    [Variant({ "ok": Null, "err": Text })],
    []
  ),
  "updateOfficialPageProfilePhoto": Func(
    [Text],
    [Variant({ "ok": Null, "err": Text })],
    []
  ),
  "updateProfile": Func([Text, Text, Visibility$1], [Bool], []),
  "updateProfilePhoto": Func(
    [Text],
    [Variant({ "ok": Null, "err": Text })],
    []
  ),
  "viewStory": Func([Nat], [], []),
  "votePoll": Func([Nat, Nat], [Bool], [])
});
const idlFactory = ({ IDL: IDL2 }) => {
  const PostId2 = IDL2.Nat;
  const CommentId2 = IDL2.Nat;
  const UserId2 = IDL2.Principal;
  const GroupId2 = IDL2.Nat;
  const Timestamp2 = IDL2.Int;
  const GroupView2 = IDL2.Record({
    "id": GroupId2,
    "coverImageData": IDL2.Opt(IDL2.Text),
    "ownerId": UserId2,
    "name": IDL2.Text,
    "createdAt": Timestamp2,
    "memberCount": IDL2.Nat,
    "isMember": IDL2.Bool,
    "description": IDL2.Text,
    "isPrivate": IDL2.Bool,
    "hasCoverImage": IDL2.Bool,
    "ownerUsername": IDL2.Text
  });
  const CreateGroupResult2 = IDL2.Variant({ "ok": GroupView2, "err": IDL2.Text });
  const Visibility2 = IDL2.Variant({
    "everyone": IDL2.Null,
    "followersOnly": IDL2.Null,
    "friendsOnly": IDL2.Null,
    "customList": IDL2.Null
  });
  const StoryId2 = IDL2.Nat;
  const UserProfile2 = IDL2.Record({
    "id": UserId2,
    "bio": IDL2.Text,
    "postCount": IDL2.Nat,
    "username": IDL2.Text,
    "aboutWebsite": IDL2.Opt(IDL2.Text),
    "birthdate": IDL2.Opt(IDL2.Text),
    "isOfficialPage": IDL2.Bool,
    "isVerified": IDL2.Bool,
    "aboutBio": IDL2.Opt(IDL2.Text),
    "aboutWork": IDL2.Opt(IDL2.Text),
    "aboutLocation": IDL2.Opt(IDL2.Text),
    "followerCount": IDL2.Nat,
    "followingCount": IDL2.Nat,
    "profilePhotoUrl": IDL2.Opt(IDL2.Text),
    "visibility": Visibility2,
    "coverPhotoUrl": IDL2.Opt(IDL2.Text),
    "aboutEducation": IDL2.Opt(IDL2.Text)
  });
  const StoryView2 = IDL2.Record({
    "id": StoryId2,
    "expiresAt": Timestamp2,
    "viewedByMe": IDL2.Bool,
    "createdAt": Timestamp2,
    "author": UserProfile2,
    "imageUrl": IDL2.Text,
    "textOverlay": IDL2.Opt(IDL2.Text),
    "viewCount": IDL2.Nat
  });
  const AdminStats2 = IDL2.Record({
    "pendingReports": IDL2.Nat,
    "totalMessages": IDL2.Nat,
    "verifiedUsers": IDL2.Nat,
    "totalUsers": IDL2.Nat,
    "totalPosts": IDL2.Nat,
    "totalStories": IDL2.Nat
  });
  const CommentView2 = IDL2.Record({
    "id": CommentId2,
    "content": IDL2.Text,
    "authorId": UserId2,
    "createdAt": Timestamp2,
    "authorName": IDL2.Text,
    "updatedAt": Timestamp2,
    "replyCount": IDL2.Nat,
    "parentId": IDL2.Opt(CommentId2),
    "postId": PostId2
  });
  const ConversationId2 = IDL2.Text;
  const ConversationSummary2 = IDL2.Record({
    "lastMessageAt": Timestamp2,
    "otherUsername": IDL2.Text,
    "lastMessagePreview": IDL2.Text,
    "otherUserId": UserId2,
    "conversationId": ConversationId2
  });
  const PostView2 = IDL2.Record({
    "id": PostId2,
    "authorVerified": IDL2.Bool,
    "content": IDL2.Text,
    "authorProfilePhoto": IDL2.Opt(IDL2.Text),
    "authorId": UserId2,
    "createdAt": Timestamp2,
    "authorName": IDL2.Text,
    "updatedAt": Timestamp2,
    "imageUrl": IDL2.Opt(IDL2.Text),
    "visibility": Visibility2,
    "isPinned": IDL2.Bool
  });
  const MessageId2 = IDL2.Nat;
  const MessageReactionView2 = IDL2.Record({
    "reactor": UserProfile2,
    "reaction": IDL2.Text
  });
  const MessageView2 = IDL2.Record({
    "id": MessageId2,
    "encryptedContent": IDL2.Vec(IDL2.Nat8),
    "createdAt": Timestamp2,
    "isRead": IDL2.Bool,
    "conversationId": ConversationId2,
    "senderId": UserId2,
    "readAt": IDL2.Opt(Timestamp2)
  });
  const ReactionType2 = IDL2.Variant({
    "sad": IDL2.Null,
    "wow": IDL2.Null,
    "angry": IDL2.Null,
    "haha": IDL2.Null,
    "like": IDL2.Null,
    "love": IDL2.Null
  });
  const NotificationId2 = IDL2.Nat;
  const NotificationType2 = IDL2.Variant({
    "verified": IDL2.Record({}),
    "like": IDL2.Record({ "postId": PostId2 }),
    "share": IDL2.Record({ "postId": PostId2 }),
    "comment": IDL2.Record({ "commentId": CommentId2, "postId": PostId2 }),
    "mention": IDL2.Record({ "postId": PostId2 }),
    "friendRequest": IDL2.Record({ "requestId": IDL2.Nat }),
    "reaction": IDL2.Record({ "reaction": ReactionType2, "postId": PostId2 }),
    "follow": IDL2.Record({})
  });
  const NotificationView2 = IDL2.Record({
    "id": NotificationId2,
    "actorName": IDL2.Text,
    "notifType": NotificationType2,
    "createdAt": Timestamp2,
    "isRead": IDL2.Bool,
    "actorId": UserId2
  });
  const FriendRequestId2 = IDL2.Nat;
  const FriendRequestView2 = IDL2.Record({
    "id": FriendRequestId2,
    "to": UserProfile2,
    "status": IDL2.Text,
    "from": UserProfile2,
    "createdAt": Timestamp2
  });
  const PollOptionResult2 = IDL2.Record({
    "id": IDL2.Nat,
    "votes": IDL2.Nat,
    "text": IDL2.Text,
    "percent": IDL2.Float64
  });
  const PollResults2 = IDL2.Record({
    "totalVotes": IDL2.Nat,
    "myVote": IDL2.Opt(IDL2.Nat),
    "options": IDL2.Vec(PollOptionResult2)
  });
  const PostStats2 = IDL2.Record({
    "shares": IDL2.Nat,
    "likes": IDL2.Nat,
    "comments": IDL2.Nat
  });
  const ReportView2 = IDL2.Record({
    "id": IDL2.Nat,
    "status": IDL2.Text,
    "reportedPost": IDL2.Opt(PostView2),
    "reportedUser": IDL2.Opt(UserProfile2),
    "createdAt": Timestamp2,
    "reporter": UserProfile2,
    "reason": IDL2.Text
  });
  const StoryFeed2 = IDL2.Record({
    "stories": IDL2.Vec(StoryView2),
    "author": UserProfile2,
    "hasUnviewed": IDL2.Bool
  });
  const HashtagStat2 = IDL2.Record({
    "postCount": IDL2.Nat,
    "hashtag": IDL2.Text
  });
  const JoinLeaveGroupResult2 = IDL2.Variant({
    "ok": IDL2.Bool,
    "err": IDL2.Text
  });
  const LoginWithPasswordResult2 = IDL2.Variant({
    "ok": IDL2.Record({ "userId": UserId2, "profile": UserProfile2 }),
    "err": IDL2.Text
  });
  const ResolveAction2 = IDL2.Variant({
    "banUser": IDL2.Null,
    "deleteContent": IDL2.Null,
    "dismiss": IDL2.Null,
    "suspendUser": IDL2.Null
  });
  const RespondAction2 = IDL2.Variant({
    "accept": IDL2.Null,
    "block": IDL2.Null,
    "decline": IDL2.Null
  });
  const SearchResults2 = IDL2.Record({
    "users": IDL2.Vec(UserProfile2),
    "posts": IDL2.Vec(PostView2)
  });
  return IDL2.Service({
    "addComment": IDL2.Func([PostId2, IDL2.Text], [CommentId2], []),
    "banUser": IDL2.Func([UserId2], [IDL2.Bool], []),
    "blockUser": IDL2.Func([UserId2], [], []),
    "cancelFriendRequest": IDL2.Func([IDL2.Nat], [IDL2.Bool], []),
    "createGroup": IDL2.Func(
      [IDL2.Text, IDL2.Text, IDL2.Bool, IDL2.Opt(IDL2.Text)],
      [CreateGroupResult2],
      []
    ),
    "createOfficialPost": IDL2.Func(
      [IDL2.Text, IDL2.Opt(IDL2.Text)],
      [IDL2.Variant({ "ok": PostId2, "err": IDL2.Text })],
      []
    ),
    "createPoll": IDL2.Func(
      [PostId2, IDL2.Text, IDL2.Vec(IDL2.Text)],
      [IDL2.Nat],
      []
    ),
    "createPost": IDL2.Func(
      [IDL2.Text, Visibility2, IDL2.Vec(UserId2), IDL2.Opt(IDL2.Text)],
      [IDL2.Variant({ "ok": PostId2, "err": IDL2.Text })],
      []
    ),
    "createStory": IDL2.Func([IDL2.Text, IDL2.Opt(IDL2.Text)], [StoryView2], []),
    "deleteComment": IDL2.Func([CommentId2], [], []),
    "deleteGroup": IDL2.Func([GroupId2], [IDL2.Bool], []),
    "deletePost": IDL2.Func([PostId2], [IDL2.Bool], []),
    "deleteStory": IDL2.Func([IDL2.Nat], [], []),
    "editComment": IDL2.Func([CommentId2, IDL2.Text], [], []),
    "editPost": IDL2.Func([PostId2, IDL2.Text], [IDL2.Bool], []),
    "followUser": IDL2.Func([UserId2], [IDL2.Bool], []),
    "getAdminStats": IDL2.Func([], [AdminStats2], ["query"]),
    "getAllUsers": IDL2.Func(
      [IDL2.Nat, IDL2.Nat],
      [IDL2.Vec(UserProfile2)],
      ["query"]
    ),
    "getComments": IDL2.Func([PostId2], [IDL2.Vec(CommentView2)], ["query"]),
    "getConversations": IDL2.Func(
      [],
      [IDL2.Vec(ConversationSummary2)],
      ["query"]
    ),
    "getFeed": IDL2.Func([], [IDL2.Vec(PostView2)], ["query"]),
    "getFriendRequestStatus": IDL2.Func([UserId2], [IDL2.Text], ["query"]),
    "getGroup": IDL2.Func([GroupId2], [IDL2.Opt(GroupView2)], ["query"]),
    "getGroups": IDL2.Func([], [IDL2.Vec(GroupView2)], ["query"]),
    "getHashtagPosts": IDL2.Func([IDL2.Text], [IDL2.Vec(PostView2)], ["query"]),
    "getLikes": IDL2.Func([PostId2], [IDL2.Vec(UserId2)], ["query"]),
    "getMessageReactions": IDL2.Func(
      [MessageId2],
      [IDL2.Vec(MessageReactionView2)],
      ["query"]
    ),
    "getMessages": IDL2.Func([UserId2], [IDL2.Vec(MessageView2)], ["query"]),
    "getMyEmail": IDL2.Func([], [IDL2.Opt(IDL2.Text)], ["query"]),
    "getMyGroups": IDL2.Func([], [IDL2.Vec(GroupView2)], ["query"]),
    "getMyProfile": IDL2.Func([], [IDL2.Opt(UserProfile2)], ["query"]),
    "getMyReaction": IDL2.Func([PostId2], [IDL2.Opt(ReactionType2)], []),
    "getMyStories": IDL2.Func([], [IDL2.Vec(StoryView2)], ["query"]),
    "getNotifications": IDL2.Func([], [IDL2.Vec(NotificationView2)], []),
    "getOfficialPage": IDL2.Func([], [UserProfile2], ["query"]),
    "getOfficialPageLink": IDL2.Func([], [IDL2.Text], ["query"]),
    "getOfficialPagePosts": IDL2.Func(
      [IDL2.Nat, IDL2.Nat],
      [IDL2.Vec(PostView2)],
      ["query"]
    ),
    "getPendingRequests": IDL2.Func(
      [],
      [IDL2.Vec(FriendRequestView2)],
      ["query"]
    ),
    "getPollResults": IDL2.Func([IDL2.Nat], [PollResults2], ["query"]),
    "getPostStats": IDL2.Func([PostId2], [PostStats2], ["query"]),
    "getProfileLink": IDL2.Func([UserId2], [IDL2.Text], ["query"]),
    "getReactions": IDL2.Func(
      [PostId2],
      [IDL2.Vec(IDL2.Tuple(ReactionType2, IDL2.Nat))],
      ["query"]
    ),
    "getReports": IDL2.Func(
      [IDL2.Nat, IDL2.Nat],
      [IDL2.Vec(ReportView2)],
      ["query"]
    ),
    "getSavedPosts": IDL2.Func([], [IDL2.Vec(PostView2)], []),
    "getSentRequests": IDL2.Func([], [IDL2.Vec(FriendRequestView2)], ["query"]),
    "getShares": IDL2.Func([PostId2], [IDL2.Nat], ["query"]),
    "getStoriesFeed": IDL2.Func([], [IDL2.Vec(StoryFeed2)], ["query"]),
    "getStoryViewers": IDL2.Func([IDL2.Nat], [IDL2.Vec(UserProfile2)], ["query"]),
    "getTrendingHashtags": IDL2.Func([], [IDL2.Vec(HashtagStat2)], ["query"]),
    "getUnreadCount": IDL2.Func([], [IDL2.Nat], []),
    "getUserPosts": IDL2.Func([UserId2], [IDL2.Vec(PostView2)], ["query"]),
    "getUserProfile": IDL2.Func([UserId2], [IDL2.Opt(UserProfile2)], ["query"]),
    "grantVerification": IDL2.Func([UserId2], [IDL2.Bool], []),
    "hasLiked": IDL2.Func([PostId2], [IDL2.Bool], []),
    "inviteMember": IDL2.Func([GroupId2, IDL2.Text], [JoinLeaveGroupResult2], []),
    "isBlocked": IDL2.Func([UserId2], [IDL2.Bool], ["query"]),
    "isFollowing": IDL2.Func([UserId2], [IDL2.Bool], ["query"]),
    "isVerified": IDL2.Func([UserId2], [IDL2.Bool], ["query"]),
    "joinGroup": IDL2.Func([GroupId2], [JoinLeaveGroupResult2], []),
    "leaveGroup": IDL2.Func([GroupId2], [JoinLeaveGroupResult2], []),
    "likePost": IDL2.Func([PostId2], [], []),
    "loginWithPassword": IDL2.Func(
      [IDL2.Text, IDL2.Text],
      [IDL2.Variant({ "ok": UserProfile2, "err": IDL2.Text })],
      []
    ),
    "loginWithPasswordOnly": IDL2.Func(
      [IDL2.Text, IDL2.Text],
      [LoginWithPasswordResult2],
      []
    ),
    "markMessageRead": IDL2.Func([MessageId2], [], []),
    "markNotificationsRead": IDL2.Func([], [], []),
    "pinPost": IDL2.Func([PostId2], [IDL2.Bool], []),
    "reactToMessage": IDL2.Func([MessageId2, ReactionType2], [IDL2.Bool], []),
    "reactToPost": IDL2.Func([PostId2, ReactionType2], [], []),
    "register": IDL2.Func([IDL2.Text, IDL2.Text], [IDL2.Bool], []),
    "registerWithPassword": IDL2.Func(
      [IDL2.Text, IDL2.Text, IDL2.Text, IDL2.Opt(IDL2.Text)],
      [IDL2.Variant({ "ok": IDL2.Bool, "err": IDL2.Text })],
      []
    ),
    "removeMessageReaction": IDL2.Func([MessageId2], [IDL2.Bool], []),
    "removeReaction": IDL2.Func([PostId2], [], []),
    "replyToComment": IDL2.Func([CommentId2, IDL2.Text], [CommentId2], []),
    "reportPost": IDL2.Func([PostId2, IDL2.Text], [], []),
    "reportUser": IDL2.Func([UserId2, IDL2.Text], [], []),
    "resolveReport": IDL2.Func([IDL2.Nat, ResolveAction2], [IDL2.Bool], []),
    "respondFriendRequest": IDL2.Func([IDL2.Nat, RespondAction2], [IDL2.Bool], []),
    "revokeVerification": IDL2.Func([UserId2], [IDL2.Bool], []),
    "savePost": IDL2.Func([PostId2], [], []),
    "searchContent": IDL2.Func([IDL2.Text], [SearchResults2], ["query"]),
    "searchUsers": IDL2.Func([IDL2.Text], [IDL2.Vec(UserProfile2)], ["query"]),
    "sendFriendRequest": IDL2.Func([UserId2], [IDL2.Bool], []),
    "sendMessage": IDL2.Func([UserId2, IDL2.Vec(IDL2.Nat8)], [MessageId2], []),
    "setMyPassword": IDL2.Func(
      [IDL2.Text],
      [IDL2.Variant({ "ok": IDL2.Bool, "err": IDL2.Text })],
      []
    ),
    "sharePost": IDL2.Func([PostId2], [], []),
    "suspendUser": IDL2.Func([UserId2, IDL2.Nat], [IDL2.Bool], []),
    "unblockUser": IDL2.Func([UserId2], [], []),
    "unfollowUser": IDL2.Func([UserId2], [IDL2.Bool], []),
    "unlikePost": IDL2.Func([PostId2], [], []),
    "unpinPost": IDL2.Func([], [IDL2.Bool], []),
    "unsavePost": IDL2.Func([PostId2], [], []),
    "unsharePost": IDL2.Func([PostId2], [], []),
    "updateAbout": IDL2.Func(
      [
        IDL2.Opt(IDL2.Text),
        IDL2.Opt(IDL2.Text),
        IDL2.Opt(IDL2.Text),
        IDL2.Opt(IDL2.Text),
        IDL2.Opt(IDL2.Text)
      ],
      [IDL2.Bool],
      []
    ),
    "updateCoverPhoto": IDL2.Func(
      [IDL2.Text],
      [IDL2.Variant({ "ok": IDL2.Null, "err": IDL2.Text })],
      []
    ),
    "updateEmail": IDL2.Func([IDL2.Text], [IDL2.Bool], []),
    "updateOfficialPageCoverPhoto": IDL2.Func(
      [IDL2.Text],
      [IDL2.Variant({ "ok": IDL2.Null, "err": IDL2.Text })],
      []
    ),
    "updateOfficialPageProfilePhoto": IDL2.Func(
      [IDL2.Text],
      [IDL2.Variant({ "ok": IDL2.Null, "err": IDL2.Text })],
      []
    ),
    "updateProfile": IDL2.Func(
      [IDL2.Text, IDL2.Text, Visibility2],
      [IDL2.Bool],
      []
    ),
    "updateProfilePhoto": IDL2.Func(
      [IDL2.Text],
      [IDL2.Variant({ "ok": IDL2.Null, "err": IDL2.Text })],
      []
    ),
    "viewStory": IDL2.Func([IDL2.Nat], [], []),
    "votePoll": IDL2.Func([IDL2.Nat, IDL2.Nat], [IDL2.Bool], [])
  });
};
function candid_some(value) {
  return [
    value
  ];
}
function candid_none() {
  return [];
}
function record_opt_to_undefined(arg) {
  return arg == null ? void 0 : arg;
}
var ReactionType = /* @__PURE__ */ ((ReactionType2) => {
  ReactionType2["sad"] = "sad";
  ReactionType2["wow"] = "wow";
  ReactionType2["angry"] = "angry";
  ReactionType2["haha"] = "haha";
  ReactionType2["like"] = "like";
  ReactionType2["love"] = "love";
  return ReactionType2;
})(ReactionType || {});
var ResolveAction = /* @__PURE__ */ ((ResolveAction2) => {
  ResolveAction2["banUser"] = "banUser";
  ResolveAction2["deleteContent"] = "deleteContent";
  ResolveAction2["dismiss"] = "dismiss";
  ResolveAction2["suspendUser"] = "suspendUser";
  return ResolveAction2;
})(ResolveAction || {});
var RespondAction = /* @__PURE__ */ ((RespondAction2) => {
  RespondAction2["accept"] = "accept";
  RespondAction2["block"] = "block";
  RespondAction2["decline"] = "decline";
  return RespondAction2;
})(RespondAction || {});
var Visibility = /* @__PURE__ */ ((Visibility2) => {
  Visibility2["everyone"] = "everyone";
  Visibility2["followersOnly"] = "followersOnly";
  Visibility2["friendsOnly"] = "friendsOnly";
  Visibility2["customList"] = "customList";
  return Visibility2;
})(Visibility || {});
class Backend {
  constructor(actor, _uploadFile, _downloadFile, processError) {
    this.actor = actor;
    this._uploadFile = _uploadFile;
    this._downloadFile = _downloadFile;
    this.processError = processError;
  }
  async addComment(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.addComment(arg0, arg1);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.addComment(arg0, arg1);
      return result;
    }
  }
  async banUser(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.banUser(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.banUser(arg0);
      return result;
    }
  }
  async blockUser(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.blockUser(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.blockUser(arg0);
      return result;
    }
  }
  async cancelFriendRequest(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.cancelFriendRequest(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.cancelFriendRequest(arg0);
      return result;
    }
  }
  async createGroup(arg0, arg1, arg2, arg3) {
    if (this.processError) {
      try {
        const result = await this.actor.createGroup(arg0, arg1, arg2, to_candid_opt_n1(this._uploadFile, this._downloadFile, arg3));
        return from_candid_CreateGroupResult_n2(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.createGroup(arg0, arg1, arg2, to_candid_opt_n1(this._uploadFile, this._downloadFile, arg3));
      return from_candid_CreateGroupResult_n2(this._uploadFile, this._downloadFile, result);
    }
  }
  async createOfficialPost(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.createOfficialPost(arg0, to_candid_opt_n1(this._uploadFile, this._downloadFile, arg1));
        return from_candid_variant_n7(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.createOfficialPost(arg0, to_candid_opt_n1(this._uploadFile, this._downloadFile, arg1));
      return from_candid_variant_n7(this._uploadFile, this._downloadFile, result);
    }
  }
  async createPoll(arg0, arg1, arg2) {
    if (this.processError) {
      try {
        const result = await this.actor.createPoll(arg0, arg1, arg2);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.createPoll(arg0, arg1, arg2);
      return result;
    }
  }
  async createPost(arg0, arg1, arg2, arg3) {
    if (this.processError) {
      try {
        const result = await this.actor.createPost(arg0, to_candid_Visibility_n8(this._uploadFile, this._downloadFile, arg1), arg2, to_candid_opt_n1(this._uploadFile, this._downloadFile, arg3));
        return from_candid_variant_n7(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.createPost(arg0, to_candid_Visibility_n8(this._uploadFile, this._downloadFile, arg1), arg2, to_candid_opt_n1(this._uploadFile, this._downloadFile, arg3));
      return from_candid_variant_n7(this._uploadFile, this._downloadFile, result);
    }
  }
  async createStory(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.createStory(arg0, to_candid_opt_n1(this._uploadFile, this._downloadFile, arg1));
        return from_candid_StoryView_n10(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.createStory(arg0, to_candid_opt_n1(this._uploadFile, this._downloadFile, arg1));
      return from_candid_StoryView_n10(this._uploadFile, this._downloadFile, result);
    }
  }
  async deleteComment(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.deleteComment(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.deleteComment(arg0);
      return result;
    }
  }
  async deleteGroup(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.deleteGroup(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.deleteGroup(arg0);
      return result;
    }
  }
  async deletePost(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.deletePost(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.deletePost(arg0);
      return result;
    }
  }
  async deleteStory(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.deleteStory(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.deleteStory(arg0);
      return result;
    }
  }
  async editComment(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.editComment(arg0, arg1);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.editComment(arg0, arg1);
      return result;
    }
  }
  async editPost(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.editPost(arg0, arg1);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.editPost(arg0, arg1);
      return result;
    }
  }
  async followUser(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.followUser(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.followUser(arg0);
      return result;
    }
  }
  async getAdminStats() {
    if (this.processError) {
      try {
        const result = await this.actor.getAdminStats();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getAdminStats();
      return result;
    }
  }
  async getAllUsers(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.getAllUsers(arg0, arg1);
        return from_candid_vec_n16(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getAllUsers(arg0, arg1);
      return from_candid_vec_n16(this._uploadFile, this._downloadFile, result);
    }
  }
  async getComments(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getComments(arg0);
        return from_candid_vec_n17(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getComments(arg0);
      return from_candid_vec_n17(this._uploadFile, this._downloadFile, result);
    }
  }
  async getConversations() {
    if (this.processError) {
      try {
        const result = await this.actor.getConversations();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getConversations();
      return result;
    }
  }
  async getFeed() {
    if (this.processError) {
      try {
        const result = await this.actor.getFeed();
        return from_candid_vec_n21(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getFeed();
      return from_candid_vec_n21(this._uploadFile, this._downloadFile, result);
    }
  }
  async getFriendRequestStatus(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getFriendRequestStatus(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getFriendRequestStatus(arg0);
      return result;
    }
  }
  async getGroup(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getGroup(arg0);
        return from_candid_opt_n24(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getGroup(arg0);
      return from_candid_opt_n24(this._uploadFile, this._downloadFile, result);
    }
  }
  async getGroups() {
    if (this.processError) {
      try {
        const result = await this.actor.getGroups();
        return from_candid_vec_n25(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getGroups();
      return from_candid_vec_n25(this._uploadFile, this._downloadFile, result);
    }
  }
  async getHashtagPosts(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getHashtagPosts(arg0);
        return from_candid_vec_n21(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getHashtagPosts(arg0);
      return from_candid_vec_n21(this._uploadFile, this._downloadFile, result);
    }
  }
  async getLikes(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getLikes(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getLikes(arg0);
      return result;
    }
  }
  async getMessageReactions(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getMessageReactions(arg0);
        return from_candid_vec_n26(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getMessageReactions(arg0);
      return from_candid_vec_n26(this._uploadFile, this._downloadFile, result);
    }
  }
  async getMessages(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getMessages(arg0);
        return from_candid_vec_n29(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getMessages(arg0);
      return from_candid_vec_n29(this._uploadFile, this._downloadFile, result);
    }
  }
  async getMyEmail() {
    if (this.processError) {
      try {
        const result = await this.actor.getMyEmail();
        return from_candid_opt_n6(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getMyEmail();
      return from_candid_opt_n6(this._uploadFile, this._downloadFile, result);
    }
  }
  async getMyGroups() {
    if (this.processError) {
      try {
        const result = await this.actor.getMyGroups();
        return from_candid_vec_n25(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getMyGroups();
      return from_candid_vec_n25(this._uploadFile, this._downloadFile, result);
    }
  }
  async getMyProfile() {
    if (this.processError) {
      try {
        const result = await this.actor.getMyProfile();
        return from_candid_opt_n33(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getMyProfile();
      return from_candid_opt_n33(this._uploadFile, this._downloadFile, result);
    }
  }
  async getMyReaction(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getMyReaction(arg0);
        return from_candid_opt_n34(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getMyReaction(arg0);
      return from_candid_opt_n34(this._uploadFile, this._downloadFile, result);
    }
  }
  async getMyStories() {
    if (this.processError) {
      try {
        const result = await this.actor.getMyStories();
        return from_candid_vec_n37(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getMyStories();
      return from_candid_vec_n37(this._uploadFile, this._downloadFile, result);
    }
  }
  async getNotifications() {
    if (this.processError) {
      try {
        const result = await this.actor.getNotifications();
        return from_candid_vec_n38(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getNotifications();
      return from_candid_vec_n38(this._uploadFile, this._downloadFile, result);
    }
  }
  async getOfficialPage() {
    if (this.processError) {
      try {
        const result = await this.actor.getOfficialPage();
        return from_candid_UserProfile_n12(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getOfficialPage();
      return from_candid_UserProfile_n12(this._uploadFile, this._downloadFile, result);
    }
  }
  async getOfficialPageLink() {
    if (this.processError) {
      try {
        const result = await this.actor.getOfficialPageLink();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getOfficialPageLink();
      return result;
    }
  }
  async getOfficialPagePosts(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.getOfficialPagePosts(arg0, arg1);
        return from_candid_vec_n21(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getOfficialPagePosts(arg0, arg1);
      return from_candid_vec_n21(this._uploadFile, this._downloadFile, result);
    }
  }
  async getPendingRequests() {
    if (this.processError) {
      try {
        const result = await this.actor.getPendingRequests();
        return from_candid_vec_n44(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getPendingRequests();
      return from_candid_vec_n44(this._uploadFile, this._downloadFile, result);
    }
  }
  async getPollResults(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getPollResults(arg0);
        return from_candid_PollResults_n47(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getPollResults(arg0);
      return from_candid_PollResults_n47(this._uploadFile, this._downloadFile, result);
    }
  }
  async getPostStats(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getPostStats(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getPostStats(arg0);
      return result;
    }
  }
  async getProfileLink(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getProfileLink(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getProfileLink(arg0);
      return result;
    }
  }
  async getReactions(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getReactions(arg0);
        return from_candid_vec_n50(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getReactions(arg0);
      return from_candid_vec_n50(this._uploadFile, this._downloadFile, result);
    }
  }
  async getReports(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.getReports(arg0, arg1);
        return from_candid_vec_n52(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getReports(arg0, arg1);
      return from_candid_vec_n52(this._uploadFile, this._downloadFile, result);
    }
  }
  async getSavedPosts() {
    if (this.processError) {
      try {
        const result = await this.actor.getSavedPosts();
        return from_candid_vec_n21(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getSavedPosts();
      return from_candid_vec_n21(this._uploadFile, this._downloadFile, result);
    }
  }
  async getSentRequests() {
    if (this.processError) {
      try {
        const result = await this.actor.getSentRequests();
        return from_candid_vec_n44(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getSentRequests();
      return from_candid_vec_n44(this._uploadFile, this._downloadFile, result);
    }
  }
  async getShares(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getShares(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getShares(arg0);
      return result;
    }
  }
  async getStoriesFeed() {
    if (this.processError) {
      try {
        const result = await this.actor.getStoriesFeed();
        return from_candid_vec_n56(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getStoriesFeed();
      return from_candid_vec_n56(this._uploadFile, this._downloadFile, result);
    }
  }
  async getStoryViewers(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getStoryViewers(arg0);
        return from_candid_vec_n16(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getStoryViewers(arg0);
      return from_candid_vec_n16(this._uploadFile, this._downloadFile, result);
    }
  }
  async getTrendingHashtags() {
    if (this.processError) {
      try {
        const result = await this.actor.getTrendingHashtags();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getTrendingHashtags();
      return result;
    }
  }
  async getUnreadCount() {
    if (this.processError) {
      try {
        const result = await this.actor.getUnreadCount();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getUnreadCount();
      return result;
    }
  }
  async getUserPosts(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getUserPosts(arg0);
        return from_candid_vec_n21(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getUserPosts(arg0);
      return from_candid_vec_n21(this._uploadFile, this._downloadFile, result);
    }
  }
  async getUserProfile(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getUserProfile(arg0);
        return from_candid_opt_n33(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getUserProfile(arg0);
      return from_candid_opt_n33(this._uploadFile, this._downloadFile, result);
    }
  }
  async grantVerification(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.grantVerification(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.grantVerification(arg0);
      return result;
    }
  }
  async hasLiked(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.hasLiked(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.hasLiked(arg0);
      return result;
    }
  }
  async inviteMember(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.inviteMember(arg0, arg1);
        return from_candid_JoinLeaveGroupResult_n59(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.inviteMember(arg0, arg1);
      return from_candid_JoinLeaveGroupResult_n59(this._uploadFile, this._downloadFile, result);
    }
  }
  async isBlocked(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.isBlocked(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.isBlocked(arg0);
      return result;
    }
  }
  async isFollowing(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.isFollowing(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.isFollowing(arg0);
      return result;
    }
  }
  async isVerified(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.isVerified(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.isVerified(arg0);
      return result;
    }
  }
  async joinGroup(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.joinGroup(arg0);
        return from_candid_JoinLeaveGroupResult_n59(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.joinGroup(arg0);
      return from_candid_JoinLeaveGroupResult_n59(this._uploadFile, this._downloadFile, result);
    }
  }
  async leaveGroup(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.leaveGroup(arg0);
        return from_candid_JoinLeaveGroupResult_n59(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.leaveGroup(arg0);
      return from_candid_JoinLeaveGroupResult_n59(this._uploadFile, this._downloadFile, result);
    }
  }
  async likePost(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.likePost(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.likePost(arg0);
      return result;
    }
  }
  async loginWithPassword(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.loginWithPassword(arg0, arg1);
        return from_candid_variant_n61(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.loginWithPassword(arg0, arg1);
      return from_candid_variant_n61(this._uploadFile, this._downloadFile, result);
    }
  }
  async loginWithPasswordOnly(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.loginWithPasswordOnly(arg0, arg1);
        return from_candid_LoginWithPasswordResult_n62(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.loginWithPasswordOnly(arg0, arg1);
      return from_candid_LoginWithPasswordResult_n62(this._uploadFile, this._downloadFile, result);
    }
  }
  async markMessageRead(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.markMessageRead(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.markMessageRead(arg0);
      return result;
    }
  }
  async markNotificationsRead() {
    if (this.processError) {
      try {
        const result = await this.actor.markNotificationsRead();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.markNotificationsRead();
      return result;
    }
  }
  async pinPost(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.pinPost(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.pinPost(arg0);
      return result;
    }
  }
  async reactToMessage(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.reactToMessage(arg0, to_candid_ReactionType_n65(this._uploadFile, this._downloadFile, arg1));
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.reactToMessage(arg0, to_candid_ReactionType_n65(this._uploadFile, this._downloadFile, arg1));
      return result;
    }
  }
  async reactToPost(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.reactToPost(arg0, to_candid_ReactionType_n65(this._uploadFile, this._downloadFile, arg1));
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.reactToPost(arg0, to_candid_ReactionType_n65(this._uploadFile, this._downloadFile, arg1));
      return result;
    }
  }
  async register(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.register(arg0, arg1);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.register(arg0, arg1);
      return result;
    }
  }
  async registerWithPassword(arg0, arg1, arg2, arg3) {
    if (this.processError) {
      try {
        const result = await this.actor.registerWithPassword(arg0, arg1, arg2, to_candid_opt_n1(this._uploadFile, this._downloadFile, arg3));
        return from_candid_variant_n60(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.registerWithPassword(arg0, arg1, arg2, to_candid_opt_n1(this._uploadFile, this._downloadFile, arg3));
      return from_candid_variant_n60(this._uploadFile, this._downloadFile, result);
    }
  }
  async removeMessageReaction(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.removeMessageReaction(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.removeMessageReaction(arg0);
      return result;
    }
  }
  async removeReaction(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.removeReaction(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.removeReaction(arg0);
      return result;
    }
  }
  async replyToComment(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.replyToComment(arg0, arg1);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.replyToComment(arg0, arg1);
      return result;
    }
  }
  async reportPost(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.reportPost(arg0, arg1);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.reportPost(arg0, arg1);
      return result;
    }
  }
  async reportUser(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.reportUser(arg0, arg1);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.reportUser(arg0, arg1);
      return result;
    }
  }
  async resolveReport(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.resolveReport(arg0, to_candid_ResolveAction_n67(this._uploadFile, this._downloadFile, arg1));
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.resolveReport(arg0, to_candid_ResolveAction_n67(this._uploadFile, this._downloadFile, arg1));
      return result;
    }
  }
  async respondFriendRequest(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.respondFriendRequest(arg0, to_candid_RespondAction_n69(this._uploadFile, this._downloadFile, arg1));
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.respondFriendRequest(arg0, to_candid_RespondAction_n69(this._uploadFile, this._downloadFile, arg1));
      return result;
    }
  }
  async revokeVerification(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.revokeVerification(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.revokeVerification(arg0);
      return result;
    }
  }
  async savePost(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.savePost(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.savePost(arg0);
      return result;
    }
  }
  async searchContent(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.searchContent(arg0);
        return from_candid_SearchResults_n71(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.searchContent(arg0);
      return from_candid_SearchResults_n71(this._uploadFile, this._downloadFile, result);
    }
  }
  async searchUsers(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.searchUsers(arg0);
        return from_candid_vec_n16(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.searchUsers(arg0);
      return from_candid_vec_n16(this._uploadFile, this._downloadFile, result);
    }
  }
  async sendFriendRequest(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.sendFriendRequest(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.sendFriendRequest(arg0);
      return result;
    }
  }
  async sendMessage(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.sendMessage(arg0, arg1);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.sendMessage(arg0, arg1);
      return result;
    }
  }
  async setMyPassword(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.setMyPassword(arg0);
        return from_candid_variant_n60(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.setMyPassword(arg0);
      return from_candid_variant_n60(this._uploadFile, this._downloadFile, result);
    }
  }
  async sharePost(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.sharePost(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.sharePost(arg0);
      return result;
    }
  }
  async suspendUser(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.suspendUser(arg0, arg1);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.suspendUser(arg0, arg1);
      return result;
    }
  }
  async unblockUser(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.unblockUser(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.unblockUser(arg0);
      return result;
    }
  }
  async unfollowUser(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.unfollowUser(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.unfollowUser(arg0);
      return result;
    }
  }
  async unlikePost(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.unlikePost(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.unlikePost(arg0);
      return result;
    }
  }
  async unpinPost() {
    if (this.processError) {
      try {
        const result = await this.actor.unpinPost();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.unpinPost();
      return result;
    }
  }
  async unsavePost(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.unsavePost(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.unsavePost(arg0);
      return result;
    }
  }
  async unsharePost(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.unsharePost(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.unsharePost(arg0);
      return result;
    }
  }
  async updateAbout(arg0, arg1, arg2, arg3, arg4) {
    if (this.processError) {
      try {
        const result = await this.actor.updateAbout(to_candid_opt_n1(this._uploadFile, this._downloadFile, arg0), to_candid_opt_n1(this._uploadFile, this._downloadFile, arg1), to_candid_opt_n1(this._uploadFile, this._downloadFile, arg2), to_candid_opt_n1(this._uploadFile, this._downloadFile, arg3), to_candid_opt_n1(this._uploadFile, this._downloadFile, arg4));
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.updateAbout(to_candid_opt_n1(this._uploadFile, this._downloadFile, arg0), to_candid_opt_n1(this._uploadFile, this._downloadFile, arg1), to_candid_opt_n1(this._uploadFile, this._downloadFile, arg2), to_candid_opt_n1(this._uploadFile, this._downloadFile, arg3), to_candid_opt_n1(this._uploadFile, this._downloadFile, arg4));
      return result;
    }
  }
  async updateCoverPhoto(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.updateCoverPhoto(arg0);
        return from_candid_variant_n73(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.updateCoverPhoto(arg0);
      return from_candid_variant_n73(this._uploadFile, this._downloadFile, result);
    }
  }
  async updateEmail(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.updateEmail(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.updateEmail(arg0);
      return result;
    }
  }
  async updateOfficialPageCoverPhoto(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.updateOfficialPageCoverPhoto(arg0);
        return from_candid_variant_n73(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.updateOfficialPageCoverPhoto(arg0);
      return from_candid_variant_n73(this._uploadFile, this._downloadFile, result);
    }
  }
  async updateOfficialPageProfilePhoto(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.updateOfficialPageProfilePhoto(arg0);
        return from_candid_variant_n73(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.updateOfficialPageProfilePhoto(arg0);
      return from_candid_variant_n73(this._uploadFile, this._downloadFile, result);
    }
  }
  async updateProfile(arg0, arg1, arg2) {
    if (this.processError) {
      try {
        const result = await this.actor.updateProfile(arg0, arg1, to_candid_Visibility_n8(this._uploadFile, this._downloadFile, arg2));
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.updateProfile(arg0, arg1, to_candid_Visibility_n8(this._uploadFile, this._downloadFile, arg2));
      return result;
    }
  }
  async updateProfilePhoto(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.updateProfilePhoto(arg0);
        return from_candid_variant_n73(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.updateProfilePhoto(arg0);
      return from_candid_variant_n73(this._uploadFile, this._downloadFile, result);
    }
  }
  async viewStory(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.viewStory(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.viewStory(arg0);
      return result;
    }
  }
  async votePoll(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.votePoll(arg0, arg1);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.votePoll(arg0, arg1);
      return result;
    }
  }
}
function from_candid_CommentView_n18(_uploadFile, _downloadFile, value) {
  return from_candid_record_n19(_uploadFile, _downloadFile, value);
}
function from_candid_CreateGroupResult_n2(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n3(_uploadFile, _downloadFile, value);
}
function from_candid_FriendRequestView_n45(_uploadFile, _downloadFile, value) {
  return from_candid_record_n46(_uploadFile, _downloadFile, value);
}
function from_candid_GroupView_n4(_uploadFile, _downloadFile, value) {
  return from_candid_record_n5(_uploadFile, _downloadFile, value);
}
function from_candid_JoinLeaveGroupResult_n59(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n60(_uploadFile, _downloadFile, value);
}
function from_candid_LoginWithPasswordResult_n62(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n63(_uploadFile, _downloadFile, value);
}
function from_candid_MessageReactionView_n27(_uploadFile, _downloadFile, value) {
  return from_candid_record_n28(_uploadFile, _downloadFile, value);
}
function from_candid_MessageView_n30(_uploadFile, _downloadFile, value) {
  return from_candid_record_n31(_uploadFile, _downloadFile, value);
}
function from_candid_NotificationType_n41(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n42(_uploadFile, _downloadFile, value);
}
function from_candid_NotificationView_n39(_uploadFile, _downloadFile, value) {
  return from_candid_record_n40(_uploadFile, _downloadFile, value);
}
function from_candid_PollResults_n47(_uploadFile, _downloadFile, value) {
  return from_candid_record_n48(_uploadFile, _downloadFile, value);
}
function from_candid_PostView_n22(_uploadFile, _downloadFile, value) {
  return from_candid_record_n23(_uploadFile, _downloadFile, value);
}
function from_candid_ReactionType_n35(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n36(_uploadFile, _downloadFile, value);
}
function from_candid_ReportView_n53(_uploadFile, _downloadFile, value) {
  return from_candid_record_n54(_uploadFile, _downloadFile, value);
}
function from_candid_SearchResults_n71(_uploadFile, _downloadFile, value) {
  return from_candid_record_n72(_uploadFile, _downloadFile, value);
}
function from_candid_StoryFeed_n57(_uploadFile, _downloadFile, value) {
  return from_candid_record_n58(_uploadFile, _downloadFile, value);
}
function from_candid_StoryView_n10(_uploadFile, _downloadFile, value) {
  return from_candid_record_n11(_uploadFile, _downloadFile, value);
}
function from_candid_UserProfile_n12(_uploadFile, _downloadFile, value) {
  return from_candid_record_n13(_uploadFile, _downloadFile, value);
}
function from_candid_Visibility_n14(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n15(_uploadFile, _downloadFile, value);
}
function from_candid_opt_n20(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : value[0];
}
function from_candid_opt_n24(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : from_candid_GroupView_n4(_uploadFile, _downloadFile, value[0]);
}
function from_candid_opt_n32(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : value[0];
}
function from_candid_opt_n33(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : from_candid_UserProfile_n12(_uploadFile, _downloadFile, value[0]);
}
function from_candid_opt_n34(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : from_candid_ReactionType_n35(_uploadFile, _downloadFile, value[0]);
}
function from_candid_opt_n49(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : value[0];
}
function from_candid_opt_n55(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : from_candid_PostView_n22(_uploadFile, _downloadFile, value[0]);
}
function from_candid_opt_n6(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : value[0];
}
function from_candid_record_n11(_uploadFile, _downloadFile, value) {
  return {
    id: value.id,
    expiresAt: value.expiresAt,
    viewedByMe: value.viewedByMe,
    createdAt: value.createdAt,
    author: from_candid_UserProfile_n12(_uploadFile, _downloadFile, value.author),
    imageUrl: value.imageUrl,
    textOverlay: record_opt_to_undefined(from_candid_opt_n6(_uploadFile, _downloadFile, value.textOverlay)),
    viewCount: value.viewCount
  };
}
function from_candid_record_n13(_uploadFile, _downloadFile, value) {
  return {
    id: value.id,
    bio: value.bio,
    postCount: value.postCount,
    username: value.username,
    aboutWebsite: record_opt_to_undefined(from_candid_opt_n6(_uploadFile, _downloadFile, value.aboutWebsite)),
    birthdate: record_opt_to_undefined(from_candid_opt_n6(_uploadFile, _downloadFile, value.birthdate)),
    isOfficialPage: value.isOfficialPage,
    isVerified: value.isVerified,
    aboutBio: record_opt_to_undefined(from_candid_opt_n6(_uploadFile, _downloadFile, value.aboutBio)),
    aboutWork: record_opt_to_undefined(from_candid_opt_n6(_uploadFile, _downloadFile, value.aboutWork)),
    aboutLocation: record_opt_to_undefined(from_candid_opt_n6(_uploadFile, _downloadFile, value.aboutLocation)),
    followerCount: value.followerCount,
    followingCount: value.followingCount,
    profilePhotoUrl: record_opt_to_undefined(from_candid_opt_n6(_uploadFile, _downloadFile, value.profilePhotoUrl)),
    visibility: from_candid_Visibility_n14(_uploadFile, _downloadFile, value.visibility),
    coverPhotoUrl: record_opt_to_undefined(from_candid_opt_n6(_uploadFile, _downloadFile, value.coverPhotoUrl)),
    aboutEducation: record_opt_to_undefined(from_candid_opt_n6(_uploadFile, _downloadFile, value.aboutEducation))
  };
}
function from_candid_record_n19(_uploadFile, _downloadFile, value) {
  return {
    id: value.id,
    content: value.content,
    authorId: value.authorId,
    createdAt: value.createdAt,
    authorName: value.authorName,
    updatedAt: value.updatedAt,
    replyCount: value.replyCount,
    parentId: record_opt_to_undefined(from_candid_opt_n20(_uploadFile, _downloadFile, value.parentId)),
    postId: value.postId
  };
}
function from_candid_record_n23(_uploadFile, _downloadFile, value) {
  return {
    id: value.id,
    authorVerified: value.authorVerified,
    content: value.content,
    authorProfilePhoto: record_opt_to_undefined(from_candid_opt_n6(_uploadFile, _downloadFile, value.authorProfilePhoto)),
    authorId: value.authorId,
    createdAt: value.createdAt,
    authorName: value.authorName,
    updatedAt: value.updatedAt,
    imageUrl: record_opt_to_undefined(from_candid_opt_n6(_uploadFile, _downloadFile, value.imageUrl)),
    visibility: from_candid_Visibility_n14(_uploadFile, _downloadFile, value.visibility),
    isPinned: value.isPinned
  };
}
function from_candid_record_n28(_uploadFile, _downloadFile, value) {
  return {
    reactor: from_candid_UserProfile_n12(_uploadFile, _downloadFile, value.reactor),
    reaction: value.reaction
  };
}
function from_candid_record_n31(_uploadFile, _downloadFile, value) {
  return {
    id: value.id,
    encryptedContent: value.encryptedContent,
    createdAt: value.createdAt,
    isRead: value.isRead,
    conversationId: value.conversationId,
    senderId: value.senderId,
    readAt: record_opt_to_undefined(from_candid_opt_n32(_uploadFile, _downloadFile, value.readAt))
  };
}
function from_candid_record_n40(_uploadFile, _downloadFile, value) {
  return {
    id: value.id,
    actorName: value.actorName,
    notifType: from_candid_NotificationType_n41(_uploadFile, _downloadFile, value.notifType),
    createdAt: value.createdAt,
    isRead: value.isRead,
    actorId: value.actorId
  };
}
function from_candid_record_n43(_uploadFile, _downloadFile, value) {
  return {
    reaction: from_candid_ReactionType_n35(_uploadFile, _downloadFile, value.reaction),
    postId: value.postId
  };
}
function from_candid_record_n46(_uploadFile, _downloadFile, value) {
  return {
    id: value.id,
    to: from_candid_UserProfile_n12(_uploadFile, _downloadFile, value.to),
    status: value.status,
    from: from_candid_UserProfile_n12(_uploadFile, _downloadFile, value.from),
    createdAt: value.createdAt
  };
}
function from_candid_record_n48(_uploadFile, _downloadFile, value) {
  return {
    totalVotes: value.totalVotes,
    myVote: record_opt_to_undefined(from_candid_opt_n49(_uploadFile, _downloadFile, value.myVote)),
    options: value.options
  };
}
function from_candid_record_n5(_uploadFile, _downloadFile, value) {
  return {
    id: value.id,
    coverImageData: record_opt_to_undefined(from_candid_opt_n6(_uploadFile, _downloadFile, value.coverImageData)),
    ownerId: value.ownerId,
    name: value.name,
    createdAt: value.createdAt,
    memberCount: value.memberCount,
    isMember: value.isMember,
    description: value.description,
    isPrivate: value.isPrivate,
    hasCoverImage: value.hasCoverImage,
    ownerUsername: value.ownerUsername
  };
}
function from_candid_record_n54(_uploadFile, _downloadFile, value) {
  return {
    id: value.id,
    status: value.status,
    reportedPost: record_opt_to_undefined(from_candid_opt_n55(_uploadFile, _downloadFile, value.reportedPost)),
    reportedUser: record_opt_to_undefined(from_candid_opt_n33(_uploadFile, _downloadFile, value.reportedUser)),
    createdAt: value.createdAt,
    reporter: from_candid_UserProfile_n12(_uploadFile, _downloadFile, value.reporter),
    reason: value.reason
  };
}
function from_candid_record_n58(_uploadFile, _downloadFile, value) {
  return {
    stories: from_candid_vec_n37(_uploadFile, _downloadFile, value.stories),
    author: from_candid_UserProfile_n12(_uploadFile, _downloadFile, value.author),
    hasUnviewed: value.hasUnviewed
  };
}
function from_candid_record_n64(_uploadFile, _downloadFile, value) {
  return {
    userId: value.userId,
    profile: from_candid_UserProfile_n12(_uploadFile, _downloadFile, value.profile)
  };
}
function from_candid_record_n72(_uploadFile, _downloadFile, value) {
  return {
    users: from_candid_vec_n16(_uploadFile, _downloadFile, value.users),
    posts: from_candid_vec_n21(_uploadFile, _downloadFile, value.posts)
  };
}
function from_candid_tuple_n51(_uploadFile, _downloadFile, value) {
  return [
    from_candid_ReactionType_n35(_uploadFile, _downloadFile, value[0]),
    value[1]
  ];
}
function from_candid_variant_n15(_uploadFile, _downloadFile, value) {
  return "everyone" in value ? "everyone" : "followersOnly" in value ? "followersOnly" : "friendsOnly" in value ? "friendsOnly" : "customList" in value ? "customList" : value;
}
function from_candid_variant_n3(_uploadFile, _downloadFile, value) {
  return "ok" in value ? {
    __kind__: "ok",
    ok: from_candid_GroupView_n4(_uploadFile, _downloadFile, value.ok)
  } : "err" in value ? {
    __kind__: "err",
    err: value.err
  } : value;
}
function from_candid_variant_n36(_uploadFile, _downloadFile, value) {
  return "sad" in value ? "sad" : "wow" in value ? "wow" : "angry" in value ? "angry" : "haha" in value ? "haha" : "like" in value ? "like" : "love" in value ? "love" : value;
}
function from_candid_variant_n42(_uploadFile, _downloadFile, value) {
  return "verified" in value ? {
    __kind__: "verified",
    verified: value.verified
  } : "like" in value ? {
    __kind__: "like",
    like: value.like
  } : "share" in value ? {
    __kind__: "share",
    share: value.share
  } : "comment" in value ? {
    __kind__: "comment",
    comment: value.comment
  } : "mention" in value ? {
    __kind__: "mention",
    mention: value.mention
  } : "friendRequest" in value ? {
    __kind__: "friendRequest",
    friendRequest: value.friendRequest
  } : "reaction" in value ? {
    __kind__: "reaction",
    reaction: from_candid_record_n43(_uploadFile, _downloadFile, value.reaction)
  } : "follow" in value ? {
    __kind__: "follow",
    follow: value.follow
  } : value;
}
function from_candid_variant_n60(_uploadFile, _downloadFile, value) {
  return "ok" in value ? {
    __kind__: "ok",
    ok: value.ok
  } : "err" in value ? {
    __kind__: "err",
    err: value.err
  } : value;
}
function from_candid_variant_n61(_uploadFile, _downloadFile, value) {
  return "ok" in value ? {
    __kind__: "ok",
    ok: from_candid_UserProfile_n12(_uploadFile, _downloadFile, value.ok)
  } : "err" in value ? {
    __kind__: "err",
    err: value.err
  } : value;
}
function from_candid_variant_n63(_uploadFile, _downloadFile, value) {
  return "ok" in value ? {
    __kind__: "ok",
    ok: from_candid_record_n64(_uploadFile, _downloadFile, value.ok)
  } : "err" in value ? {
    __kind__: "err",
    err: value.err
  } : value;
}
function from_candid_variant_n7(_uploadFile, _downloadFile, value) {
  return "ok" in value ? {
    __kind__: "ok",
    ok: value.ok
  } : "err" in value ? {
    __kind__: "err",
    err: value.err
  } : value;
}
function from_candid_variant_n73(_uploadFile, _downloadFile, value) {
  return "ok" in value ? {
    __kind__: "ok",
    ok: value.ok
  } : "err" in value ? {
    __kind__: "err",
    err: value.err
  } : value;
}
function from_candid_vec_n16(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_UserProfile_n12(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n17(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_CommentView_n18(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n21(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_PostView_n22(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n25(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_GroupView_n4(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n26(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_MessageReactionView_n27(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n29(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_MessageView_n30(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n37(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_StoryView_n10(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n38(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_NotificationView_n39(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n44(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_FriendRequestView_n45(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n50(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_tuple_n51(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n52(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_ReportView_n53(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n56(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_StoryFeed_n57(_uploadFile, _downloadFile, x));
}
function to_candid_ReactionType_n65(_uploadFile, _downloadFile, value) {
  return to_candid_variant_n66(_uploadFile, _downloadFile, value);
}
function to_candid_ResolveAction_n67(_uploadFile, _downloadFile, value) {
  return to_candid_variant_n68(_uploadFile, _downloadFile, value);
}
function to_candid_RespondAction_n69(_uploadFile, _downloadFile, value) {
  return to_candid_variant_n70(_uploadFile, _downloadFile, value);
}
function to_candid_Visibility_n8(_uploadFile, _downloadFile, value) {
  return to_candid_variant_n9(_uploadFile, _downloadFile, value);
}
function to_candid_opt_n1(_uploadFile, _downloadFile, value) {
  return value === null ? candid_none() : candid_some(value);
}
function to_candid_variant_n66(_uploadFile, _downloadFile, value) {
  return value == "sad" ? {
    sad: null
  } : value == "wow" ? {
    wow: null
  } : value == "angry" ? {
    angry: null
  } : value == "haha" ? {
    haha: null
  } : value == "like" ? {
    like: null
  } : value == "love" ? {
    love: null
  } : value;
}
function to_candid_variant_n68(_uploadFile, _downloadFile, value) {
  return value == "banUser" ? {
    banUser: null
  } : value == "deleteContent" ? {
    deleteContent: null
  } : value == "dismiss" ? {
    dismiss: null
  } : value == "suspendUser" ? {
    suspendUser: null
  } : value;
}
function to_candid_variant_n70(_uploadFile, _downloadFile, value) {
  return value == "accept" ? {
    accept: null
  } : value == "block" ? {
    block: null
  } : value == "decline" ? {
    decline: null
  } : value;
}
function to_candid_variant_n9(_uploadFile, _downloadFile, value) {
  return value == "everyone" ? {
    everyone: null
  } : value == "followersOnly" ? {
    followersOnly: null
  } : value == "friendsOnly" ? {
    friendsOnly: null
  } : value == "customList" ? {
    customList: null
  } : value;
}
function createActor(canisterId, _uploadFile, _downloadFile, options = {}) {
  const agent = options.agent || HttpAgent.createSync({
    ...options.agentOptions
  });
  if (options.agent && options.agentOptions) {
    console.warn("Detected both agent and agentOptions passed to createActor. Ignoring agentOptions and proceeding with the provided agent.");
  }
  const actor = Actor.createActor(idlFactory, {
    agent,
    canisterId,
    ...options.actorOptions
  });
  return new Backend(actor, _uploadFile, _downloadFile, options.processError);
}
function useAuthenticatedBackend() {
  return useActor(createActor);
}
const PASSWORD_AUTH_KEY = "passwordAuthUserId";
function getStoredPasswordSession() {
  try {
    return localStorage.getItem(PASSWORD_AUTH_KEY);
  } catch {
    return null;
  }
}
function setStoredPasswordSession(userId) {
  try {
    localStorage.setItem(PASSWORD_AUTH_KEY, userId);
  } catch {
  }
}
function clearStoredPasswordSession() {
  try {
    localStorage.removeItem(PASSWORD_AUTH_KEY);
  } catch {
  }
}
function useCurrentUser() {
  const { identity, isInitializing, clear: clearII } = useInternetIdentity();
  const { actor, isFetching } = useAuthenticatedBackend();
  const queryClient = useQueryClient();
  const [passwordProfile, setPasswordProfile] = reactExports.useState(null);
  const [passwordSessionChecked, setPasswordSessionChecked] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const stored = getStoredPasswordSession();
    if (!stored) {
      setPasswordProfile(false);
      setPasswordSessionChecked(true);
      return;
    }
  }, []);
  reactExports.useEffect(() => {
    if (passwordSessionChecked) return;
    if (!actor || isFetching) return;
    const stored = getStoredPasswordSession();
    if (!stored) {
      setPasswordProfile(false);
      setPasswordSessionChecked(true);
      return;
    }
    void (async () => {
      try {
        const { Principal: Principal2 } = await __vitePreload(async () => {
          const { Principal: Principal3 } = await Promise.resolve().then(() => index);
          return { Principal: Principal3 };
        }, true ? void 0 : void 0);
        const userId = Principal2.fromText(stored);
        const profile2 = await actor.getUserProfile(userId);
        if (profile2) {
          setPasswordProfile(profile2);
        } else {
          clearStoredPasswordSession();
          setPasswordProfile(false);
        }
      } catch {
        clearStoredPasswordSession();
        setPasswordProfile(false);
      } finally {
        setPasswordSessionChecked(true);
      }
    })();
  }, [actor, isFetching, passwordSessionChecked]);
  const { data: iiProfile, isLoading: isProfileLoading } = useQuery({
    queryKey: ["myProfile"],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.getMyProfile();
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching && !!identity,
    retry: 1
  });
  const registerMutation = useMutation({
    mutationFn: async ({
      username,
      bio
    }) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.register(username, bio);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myProfile"] });
    }
  });
  const registerWithPasswordMutation = useMutation({
    mutationFn: async ({
      username,
      password,
      email,
      bio
    }) => {
      if (!actor) throw new Error("Not authenticated");
      const result = await actor.registerWithPassword(
        username,
        password,
        bio,
        email ?? null
      );
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myProfile"] });
    }
  });
  const loginWithPasswordMutation = useMutation({
    mutationFn: async ({
      username,
      password
    }) => {
      if (!actor) throw new Error("Backend not ready");
      const result = await actor.loginWithPasswordOnly(username, password);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (data) => {
      const userIdText = data.userId.toText();
      setStoredPasswordSession(userIdText);
      setPasswordProfile(data.profile);
      setPasswordSessionChecked(true);
      queryClient.invalidateQueries({ queryKey: ["myProfile"] });
    }
  });
  const registerWithPasswordOnlyMutation = useMutation({
    mutationFn: async ({
      username,
      password,
      email,
      bio
    }) => {
      if (!actor) throw new Error("Backend not ready");
      const regResult = await actor.registerWithPassword(
        username,
        password,
        bio,
        email ?? null
      );
      if (regResult.__kind__ === "err") throw new Error(regResult.err);
      const loginResult = await actor.loginWithPasswordOnly(username, password);
      if (loginResult.__kind__ === "err") throw new Error(loginResult.err);
      return loginResult.ok;
    },
    onSuccess: (data) => {
      const userIdText = data.userId.toText();
      setStoredPasswordSession(userIdText);
      setPasswordProfile(data.profile);
      setPasswordSessionChecked(true);
      queryClient.invalidateQueries({ queryKey: ["myProfile"] });
    }
  });
  const logout = reactExports.useCallback(() => {
    clearStoredPasswordSession();
    setPasswordProfile(false);
    setPasswordSessionChecked(true);
    if (clearII) clearII();
    queryClient.clear();
  }, [clearII, queryClient]);
  let status = "initializing";
  const isPasswordAuthenticated = passwordSessionChecked && passwordProfile !== null && passwordProfile !== false;
  if (!passwordSessionChecked || isInitializing || isFetching) {
    status = "initializing";
  } else if (isPasswordAuthenticated) {
    status = "authenticated";
  } else if (!identity) {
    status = "unauthenticated";
  } else if (isProfileLoading) {
    status = "initializing";
  } else if (iiProfile === null || iiProfile === void 0) {
    status = "registering";
  } else {
    status = "authenticated";
  }
  const profile = isPasswordAuthenticated ? passwordProfile : iiProfile ?? null;
  return {
    status,
    profile,
    identity,
    isPasswordSession: isPasswordAuthenticated,
    // II registration
    register: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error,
    // II + password registration (used when II is active, status=registering)
    registerWithPassword: registerWithPasswordMutation.mutateAsync,
    isRegisteringWithPassword: registerWithPasswordMutation.isPending,
    registerWithPasswordError: registerWithPasswordMutation.error,
    // Password-only login (no II needed)
    loginWithPassword: loginWithPasswordMutation.mutateAsync,
    isLoggingInWithPassword: loginWithPasswordMutation.isPending,
    loginWithPasswordError: loginWithPasswordMutation.error,
    // Password-only registration + auto-login (no II needed)
    registerWithPasswordOnly: registerWithPasswordOnlyMutation.mutateAsync,
    isRegisteringWithPasswordOnly: registerWithPasswordOnlyMutation.isPending,
    registerWithPasswordOnlyError: registerWithPasswordOnlyMutation.error,
    logout
  };
}
const index = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  JSON_KEY_PRINCIPAL,
  Principal,
  base32Decode,
  base32Encode,
  getCrc32
}, Symbol.toStringTag, { value: "Module" }));
export {
  Primitive as P,
  RespondAction as R,
  Slot as S,
  Visibility as V,
  useAuthenticatedBackend as a,
  useQuery as b,
  useMutation as c,
  useComposedRefs as d,
  ReactionType as e,
  ResolveAction as f,
  composeRefs as g,
  index as i,
  useCurrentUser as u
};
