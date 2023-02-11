type Combinable = number | string;
type ConversionDescriptor = "asNumber" | "asText";

function combine(
	input1: Combinable,
	input2: Combinable,
	resultConversion: ConversionDescriptor
) {
	let result;
	if (
		(typeof input1 === "number" && typeof input2 === "number") ||
		resultConversion === "asNumber"
	) {
		result = +input1 + +input2;
	} else {
		result = input1.toString() + input2.toString();
	}

	return result;

	// if (resultConversion === "asNumber") {
	// 	return +result;
	// } else {
	// 	return result.toString();
	// }
}

const comAges = combine(30, 26, "asNumber");
console.log(comAges);

const comStrAges = combine("30", "26", "asNumber");
console.log(comStrAges);

const comNames = combine("Max", "Anna", "asText");
console.log(comNames);
