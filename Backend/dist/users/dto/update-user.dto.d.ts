import { CreateUserDto } from "./create-user.dto";
declare const UpdateUserDto_base: import("@nestjs/common").Type<Partial<CreateUserDto>>;
export declare class UpdateUserDto extends UpdateUserDto_base {
    profile?: {
        bio?: string;
        website?: string;
        twitter?: string;
        discord?: string;
    };
}
export {};
