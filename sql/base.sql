CREATE TABLE categories (
    id uuid DEFAULT uuid_generate_v4 (),
    parentid uuid,
    name VARCHAR NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE products (
    id uuid DEFAULT uuid_generate_v4 (),
    name VARCHAR NOT NULL,
    price NUMERIC(5, 2),
    description VARCHAR NOT NULL,
    categoryid uuid,
    FOREIGN KEY (categoryid) REFERENCES categories (id),
    PRIMARY KEY (id)
);

CREATE TABLE product_images (
    id uuid DEFAULT uuid_generate_v4 (),
    productid uuid,
    url VARCHAR NOT NULL,
    main BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (productid) REFERENCES products (id),
    PRIMARY KEY (id)
);