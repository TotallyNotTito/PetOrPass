/** @module Models/Pet */
import {BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";

/**
 *  Class representing pets table
 */
@Entity({name: "pets"})
export class Pet extends BaseEntity {

    // Field to store the unique ID of a pet
    @PrimaryGeneratedColumn()
    id: number;

    // Field to store the pet's name
    @Column('text')
    pet_name: string;

    // Field to store the pet's image name
    // Image file stored separately in MinIO file storage
    @Column('text')
    image_name: string;

    // Field to store the cumulative score of a pet
    // This field can be used with the total_votes field to calculate a pet's average score
    // Example: If a pet receives two scores of 10, then this field will hold a value of 20
    @Column('integer')
    total_score: number;

    // Field to store the number of votes a pet has received
    // This field can be used with the total_score field to calculate a pet's average score
    // Example: If a pet receives votes from two different users, then this field will hold a value of 2
    @Column('integer')
    total_votes: number;

    // Field to store the Auth0 ID for the user that submitted the pet
    @Column('text')
    submitted_by: string;

    // Field to store the date the pet record was created
    @CreateDateColumn()
    created_at: string;

    // Field to store the date the pet record was last updated
    @UpdateDateColumn()
    updated_at: string;
}
