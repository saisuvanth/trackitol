import CreateExpense from "@/components/expense/create-expense";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import dbConnect from "@/lib/dbConnect";
import { Group } from "@/models";
import { GetServerSideProps, NextPage } from "next";
import { useSession } from "next-auth/react";

interface GroupsProps {
    group: any;
}

const Groups: NextPage<GroupsProps> = ({ group }) => {
    const { data: session } = useSession();

    if (!group) {
        return <div className="flex justify-center items-center">Group not found</div>
    }

    return (
        <div className="p-2 md:p-12 flex flex-col gap-4">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        {group.name}

                    </CardTitle>
                    <CardDescription>
                        {group.description}
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <div className="flex gap-4">
                        {group.members.map((member: any) => (
                            <TooltipProvider key={member._id}>
                                <Tooltip >
                                    <TooltipTrigger asChild>
                                        <Avatar className="cursor-pointer">
                                            <AvatarImage src={member.user.image} />
                                            <AvatarFallback>
                                                {member.user.name[0].toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <div className="flex flex-col px-2 py-1">
                                            <span>
                                                {member.user.name}
                                            </span>
                                            <span>{member.user.email}</span>
                                        </div>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        ))}
                    </div>
                    <div className="flex flex-col ">
                        <div className="flex items-center justify-between">
                            <div className="text-xl font-semibold">Expenses</div>
                            <CreateExpense friendsData={group.members.filter((mem: any) => mem.user._id !== session?.user?.id).map((mem: any) => ({ ...mem.user }))} />
                        </div>

                    </div>
                </CardContent>
            </Card>
        </div>
    )
}


export default Groups;


export const getServerSideProps: GetServerSideProps<GroupsProps> = async (context) => {
    const { params } = context;
    const { id } = params as any;

    await dbConnect();

    const group = await Group.findById(id).populate({ path: 'members', populate: [{ path: 'user' }] }).populate('expenses');
    return {
        props: {
            group: JSON.parse(JSON.stringify(group))
        }
    }

}