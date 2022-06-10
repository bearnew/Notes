try {
    console.log("step1");
    throw EvalError("2222");
} catch (error) {
    console.log("step2");
} finally {
    console.log("step3");
}
