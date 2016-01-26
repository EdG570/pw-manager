var person = {
  firstname: 'Ed',
  age: 24
};

var personJSON = JSON.stringify(person);

console.log(personJSON);
console.log(typeof personJSON);

var personObject = JSON.parse(personJSON);

console.log(personObject.firstname);
console.log(typeof personObject);



console.log('CHALLENGE AREA:');

var animal = '{"name": "Miyagi"}';

var animalObject = JSON.parse(animal);

animalObject.age = 5;

animal = JSON.stringify(animalObject);

console.log(animal);
