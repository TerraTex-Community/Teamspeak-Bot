import {BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";

@Entity()
export class TsUser extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        unique: true
    })
    uniqueId: string;

    @Column({
        default: false,
        type: "boolean"
    })
    registered: boolean;

    @Column({
        nullable: true,
        default: null,
        type: "varchar",
        collation: "utf8mb4_bin",
        charset: "utf8mb4"
    })
    lastNickname: string;

    @Column({
        type: "datetime"
    })
    lastLogin: Date;

    @CreateDateColumn()
    createDate: Date;

    @UpdateDateColumn()
    updateDate: Date;
}
