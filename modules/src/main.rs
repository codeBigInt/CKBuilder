mod greetings;
mod utils;
use crate::utils::math::add;
use crate::lib::percentage_calc::calculate_percentage_composition;

fn main() {
    greetings::say_hello(String::from("Elliot"));
    println!("{}", add(2, 1));
    println!("Fractional part makes {}% of the total matter", calculate_percentage_composition(31, 144));
}
