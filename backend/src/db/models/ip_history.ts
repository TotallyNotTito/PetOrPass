/** @module Models/IPHistory */
import {BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Relation} from "typeorm";
import {User} from "./user";

/**
 * IPHistory model - holds all IPs a user has logged in with
 */
@Entity()
export class IPHistory extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: string;

	@Column("text")
	ip: string;

	@ManyToOne((type) => User, (user: User) => user.ips, {
		//adding an IPHistory will also add associated User if it is new, somewhat useless in this example
		cascade: true,
		// if we delete a User, also delete their IP History
		onDelete: "CASCADE"
	})
	user: Relation<User>;

	@CreateDateColumn()
	created_at: string;
}
