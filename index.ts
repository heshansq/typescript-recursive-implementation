// Extend this type to make it support the usage below.
// path should be recieved in dot notation and should give suggestions on keys.
// correct return type should be calculated depending on the given path.

/**
 * commented out get function declaration here to use arrow functional way
 */
//declare function get(obj: MultiObject, path: string): unknown;

/**
 * Option 01: RECURSIVE Implementation
 * 1. type MultiObject: created new MultiObject type to declare object. Allows number, Object or string as the value types accepted.
 * 2. type Option<T>: Option<T> is an extra type implemented to allow undefined type returns. Used undefined return instead of an Exception.
 * 3. type Get: Get type is the return type of get method which allows 2 parameters and returns an Option<T>
 */


/**
 * implemented interfaces for Object Mapping with JSON
 */
 interface Address {
  street: string,
  city: string
}

interface Friend {
  fullName: string,
  age?: number
}

/**
* TODO: Instead of using list of objects, we can make frieds to array of friends to make it more dynamic
*/
interface InnerUser {
  fullName: string,
  age: number,
  address: Address,
  friends: {
      0: Friend,
      1: Friend
  }
}

interface User {
  user: InnerUser
}

/**
* Type Implementations
*/
type FriendOuter = Record<string | number, Friend>;

/**
* Used union of prefined types
*/
type MultiObject = User | InnerUser | FriendOuter | Address;
type Option<T> = T | MultiObject | undefined;
type Get = <T extends MultiObject>(obj: User, path: string) => Option<T>;
type GetKey = <T extends MultiObject>(remainingKeys: string[], currentObject: MultiObject) => Option<T>;

/**
* getKeyValue: a recursive function outside of main get function. Used recursive function to improve functional way of the implementation.
* To improve immutability of objects uses recursive function which will not mutate currentObject.
* Since this method uses recursive iterations and return type is different, used generic T type.
*/
const getKeyValue: GetKey = <T, >(remainingKeys: string[], currentObject: MultiObject): Option<T> => {
  if (remainingKeys.length === 0) {
      return currentObject;
  }

  const [currentKey, ...restKeys] = remainingKeys;
  const nextObject: MultiObject = currentObject?.[currentKey as keyof MultiObject];

  return nextObject ? getKeyValue(restKeys, nextObject) : undefined;
}

const get: Get = <T, >(userObj: User, path: string): Option<T> => {
  const allKeys = path.split(".");
  return getKeyValue(allKeys, userObj);
}

const object = {
  "user": {
      "fullName": "Janis Pagac",
      "age": 30,
      "address": {
          "street": "83727 Beatty Garden",
          "city": "Hamilton"
      },
      "friends": {
          "0": {
              "fullName": "Franklin Kuhn",
              "age": 20
          },
          "1": {
              "fullName": "Hubert Sawayn"
          }
      }
  }
};

const fullName: Option<string> = get(object, "user.fullName");
const age: Option<number> = get(object, "user.age");
const street: Option<string> = get(object, "user.address.street");
const fullNameOfFriend: Option<string> = get(object, "user.friends.0.fullName");
const ageOfFriend: Option<number> = get(object, "user.friends.0.age");

console.log({fullNameOfFriend}, typeof fullNameOfFriend);
console.log({street}, typeof street);
console.log({age}, typeof age);
console.log({fullName}, typeof fullName);
console.log({ageOfFriend}, typeof ageOfFriend);