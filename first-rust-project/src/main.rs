fn main() {
    let x: i32 = -42;
    let y: u64 = 100;

    println!("Signed Integers: {}", x);
    println!("Unsigned Integers: {}", y);

    let pi: f64 = 3.14;

    println!("Value of pi: {}", pi);

    let is_snowing: bool = true;
    println!("Is it snowing? {}", is_snowing);

    let name: char = 'a';

    println!("Hello! {}", name);

    //Compound data types
    //arrays, tuples, slice, string and slice string

    //Arrays
    let numbers_arr: [i32; 5] = [1, 2, 3, 4, 5];
    println!("My numbers {:?}", numbers_arr);

    //NB: arrays must be of homogenous datatype

    let fruits: [&str; 3] = ["apple", "banana", "pawpaw"];
    println!("My fruit list {:?}", fruits);

    // let myStr: &str = "Hello";

    //Turples
    let human: (String, u8, bool) = ("Alice".to_string(), 30, false);
    println!("My turple {:?}", human);
    let mixed_turple: (&str, [i32; 3], bool) = ("Hello Elliot", [1, 2, 3], false);
    println!("My mixed turple {:?}", mixed_turple);

    //NB: Turples can store any datatype

    // Slices

    let number_slice: &[i32] = &[1, 2, 3];

    println!("My slice: {:?}", number_slice);

    hello_world("Elliot", 22, 185.2);

    let x: i32 = {
        let price = 5;
        let qty = 10;

        price * qty
    };

    println!("Result is: {}", x);

    let add_result: i32 = add(40, 160);

    println!("Additon result: {}", add_result);

    let weight_kg: f64 = 70.5;
    let height: f64 = 1.8;

    let bmi = calc_bmi(weight_kg, height);

    println!("Your Body-Mass-Index (BMI) is: {:.2}", bmi);

    //OWNERSHIP, BORROWING AND REFRENCING IN RUST

    //RULES OF OWNERSHIP
    // 1. Each value in rust has an owner
    // 2. There ca only be one owner at a time
    // 3. When the owner goes out of scope, the value will be dropped

    let s1 = String::from("RUST");

    let len = cal_length_of_string(&s1);
    println!("Length of {} is: {}", s1, len);

    let s2 = s1;

    println!("{}", s2);

    //BORROWING AND REFRENCING
    let mut o = 5;

    let r = &mut o;

    *r += 1;
    *r -= 3;


    println!("value of o = {}", o);

    let mut _account = BankAccount {
        owner: "Alice".to_string(),
        balance: 1098.86
    };

    _account.check_balance();

    _account.withdraw(120.86);

    _account.check_balance();


    //CONTROL FLOW IN RUST
    // 1- Conditions
    // 2- Repeated actions

}

fn cal_length_of_string(s: &String) -> usize {
    s.len()
}

//Hoisted function
fn hello_world(name: &str, age: i32, height: f32) {
    println!(
        "Hello name {}, I heard u're {} yrs old and {}cm tall",
        name, age, height
    );
}

//  Fnctions can return a value
// Expressions and statements

//Expression: anything that returns a value
//State: does not return a value

//Examples of expression
//add(3, 4)
//5
//true
//if condition {value 1} else {value 2}
fn add(a: i32, b: i32) -> i32 {
    a + b
}

//Statements does not return a value, e.g
//Variables
//Function definition: fn foo(){}
//Control flow

fn calc_bmi(weight_kg: f64, height: f64) -> f64 {
    weight_kg / (height * height)
}

struct BankAccount {
    owner: String,
    balance: f64,
}

//Structs
impl BankAccount {
    fn withdraw(&mut self, amount: f64){
        println!("Withdrawing ${} from {}'s account", amount, self.owner);

        self.balance -= amount;
    }

    fn check_balance(&self) {
        println!("{} has a balnace of ${} left in their account", self.owner, self.balance);
    }
}

// //Variables and mutability


// #![allow(warnings)]

// fn main(){
//     // let age: u16 = 18;

//     // if age >= 18 {
//     //     println!("You are old enough to drive a car");
//     // }else {
//     //     println!("You can't drive a car")
//     // }

//     let num: u16 = 6;
//     if num % 4 == 0 {
//         println!("Number is divisible by 4");
//     }else if num % 3 == 0 {
//         println!("Number is divisible by 3")
//     }else if num % 2 == 0 {
//         println!("Number is divisible by 2")
//     }else {
//         println!("Number not divisible by 4, 3, or 2");
//     }
// }