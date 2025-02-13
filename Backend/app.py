from dbconnection import *

table_name="test_table"
insert_data={
    "name": "raj",
    "email": "base@gmail.com",
    "age": 28
}
print(insert_to_table(table_name,insert_data))