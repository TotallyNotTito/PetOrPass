/** @module Models/Pet */
import TypeORM from "typeorm";

/**
 *  Class representing pets table
 */
@TypeORM.Entity({name: "pets"})
export class Pet extends TypeORM.BaseEntity {

    // Field to store the unique ID of a pet
    @TypeORM.PrimaryGeneratedColumn()
    id: number;

    // Field to store the pet's name
    @TypeORM.Column('text')
    pet_name: string;

    // Field to store the pet's image name
    // Image file stored separately in MinIO file storage
    @TypeORM.Column('text')
    image_name: string;

    // Field to store the cumulative score of a pet
    // This field can be used with the total_votes field to calculate a pet's average score
    // Example: If a pet receives two scores of 10, then this field will hold a value of 20
    @TypeORM.Column('integer')
    total_score: number;

    // Field to store the number of votes a pet has received
    // This field can be used with the total_score field to calculate a pet's average score
    // Example: If a pet receives votes from two different users, then this field will hold a value of 2
    @TypeORM.Column('integer')
    total_votes: number;

    // Field to store the email address for the user that submitted the pet
    @TypeORM.Column('text')
    submitted_by: string;

    // Field to store the date the pet record was created
    @TypeORM.CreateDateColumn()
    created_at: string;

    // Field to store the date the pet record was last updated
    @TypeORM.UpdateDateColumn()
    updated_at: string;
}
