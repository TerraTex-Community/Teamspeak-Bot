import {BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";

@Entity({
    name: "channelstatistics"
})
export class DbChannelStatistics extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    channelId: number;

    @Column()
    userCount: number;

    @Column()
    userCountWithChilds: number;

    @CreateDateColumn()
    createDate: Date;

    @UpdateDateColumn()
    updateDate: Date;
}
