// dataProcessor.worker.js

self.onmessage = function (e) {

    console.log('worker', e);

    const { update, componentKey } = e.data;

    const [nextValue] = update.value;
    const newValue =
        nextValue && Object.prototype.hasOwnProperty.call(nextValue, "value")
            ? nextValue.value
            : nextValue;

    const entityID = update.entity;
    const propertyName = componentKey === "ContainedMaterial" ? "materialId" : update.toCamelCase(componentKey);

    // Simulate the processing logic and structure from your original code
    const processedUpdate = {
        entityID,
        propertyName,
        newValue
    };

    // Send processed update back to the main thread
    self.postMessage(processedUpdate);
};