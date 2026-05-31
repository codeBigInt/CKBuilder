#[derive(Debug)]

struct MamaRectangle {
    length: u64,
    bredth: u64,
}

impl MamaRectangle {
    fn area(&self) -> u64 {
        self.length * self.bredth
    }

    fn square(size: u64) -> Self {
        MamaRectangle {
            length: size,
            bredth: size,
        }
    }
}

fn main() {
    let new_rectangle = MamaRectangle {
        length: 896,
        bredth: 10000000000000000,
    };

    println!("The area of the mamarectangle is: {}", new_rectangle.area());

    let square = MamaRectangle::square(30);

    println!("The new square has a dimension of: {square:#?}");
    dbg!(&square);
}

