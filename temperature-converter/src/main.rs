use std::io;
enum ConversionChoice {
    // Unnecessary but just for learning
    ToCelsius(f64),
    ToFahrenheit(f64),
}

fn main() {
    loop {
        println!("Convert Temperature between Celsius and Fahrenheit");
        println!(
            "Select Options (Enter 1 or 2:\n(1) Fahrenheit To Celsius\n(2) Celsius To Fahrenheit"
        );
        let mut user_choice: String = String::new();

        io::stdin()
            .read_line(&mut user_choice)
            .expect("Failed to read input");

        let user_choice: i32 = user_choice.trim().parse().expect("Please enter 1 or 2");

        if user_choice != 1 && user_choice != 2 {
            println!("Please enter 1 or 2");
            break;
        }

        println!("Enter the value to convert. e.g 22.5");
        let mut value_to_convert: String = String::new();

        io::stdin()
            .read_line(&mut value_to_convert)
            .expect("Invalid input");

        let value_input: f64 = value_to_convert.trim().parse().expect("Invalid input");

        if user_choice == 1 {
            inspect_choice(ConversionChoice::ToCelsius(value_input));
            continue;
        } else if user_choice == 2 {
            inspect_choice(ConversionChoice::ToFahrenheit(value_input));
            continue;
        } else {
            println!("Please enter 1 or 2");
            break;
        }
    }
}

fn convert_to_celsius(temp_in_fahrenheit: f64) -> f64 {
    let result = (temp_in_fahrenheit - 32f64) / 1.8;

    println!(
        "The Resultant value of {} Fahrenheit converted to Celsius is: {}",
        temp_in_fahrenheit, result
    );

    result
}

fn convert_to_fahrenheit(temp_in_celsius: f64) -> f64 {
    let result = (temp_in_celsius * 1.8) + 32f64;

    println!(
        "The Resultant value of {} Celsius converted to Fahrenheit is: {}",
        temp_in_celsius, result
    );

    result
}

fn inspect_choice(choice: ConversionChoice) {
    match choice {
        ConversionChoice::ToFahrenheit(c) => convert_to_fahrenheit(c),
        ConversionChoice::ToCelsius(f) => convert_to_celsius(f),
    };
}
