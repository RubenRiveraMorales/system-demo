import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from "typeorm";
import { User } from "src/users/entities/user.entity";

export enum MissionCategory {
    FITNESS = 'fitness',
    PRODUCTIVITY = 'productivity',
    ENTERTAINMENT = 'entertainment',
    MAINTENANCE = 'maintenance',
    CUSTOM = 'custom',
}

@Entity()
export class Mission {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({ nullable: true})
    description: string;

    @Column('int')
    xpReward: number;

    @Column({ default: false})
    isPremium: boolean;

    @Column({ default: true})
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column({
        type: 'enum',
        enum: MissionCategory,
        default: MissionCategory.CUSTOM
    })
    category: MissionCategory;

    @Column({ default: false })
    isGlobal: boolean;

    @ManyToOne(() => User, (user) => user.missions, { nullable: true, eager: false })
    user: User;
}
