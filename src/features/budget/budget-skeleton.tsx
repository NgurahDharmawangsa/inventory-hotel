"use client";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export function BudgetTableSkeleton() {
	return (
		<div className='rounded-xl border border-border bg-card overflow-hidden shadow-xs'>
			<Table>
				<TableHeader className='bg-muted/30'>
					<TableRow className='hover:bg-transparent'>
						<TableHead className='font-bold pl-4'>
							<div className='flex items-center gap-1.5 py-2'>
								<span>Budget Year</span>
							</div>
						</TableHead>
						<TableHead className='font-bold'>
							<div className='flex items-center gap-1.5 py-2'>
								<span>Allocated Budget</span>
							</div>
						</TableHead>
						<TableHead className='font-bold'>
							<div className='flex items-center gap-1.5 py-2'>
								<span>Spent Budget</span>
							</div>
						</TableHead>
						<TableHead className='font-bold'>
							<div className='flex items-center gap-1.5 py-2'>
								<span>Budget Utilization</span>
							</div>
						</TableHead>
						<TableHead className='font-bold'>Notes</TableHead>
						<TableHead className='font-bold text-right pr-4'>Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{Array.from({ length: 8 }).map((_, i) => (
						<TableRow
							key={i}
							className='hover:bg-transparent border-b border-border/50'
						>
							{/* Budget Year */}
							<TableCell className='pl-4 py-3'>
								<Skeleton className='h-5 w-16' />
							</TableCell>

							{/* Allocated Budget */}
							<TableCell className='py-3'>
								<Skeleton className='h-4 w-32' />
							</TableCell>

							{/* Spent Budget */}
							<TableCell className='py-3'>
								<Skeleton className='h-4 w-32' />
							</TableCell>

							{/* Budget Utilization */}
							<TableCell className='py-3'>
								<div className='space-y-2'>
									<div className='flex items-center justify-between gap-2'>
										<Skeleton className='h-3 w-16' />
										<Skeleton className='h-5 w-20 rounded-full' />
									</div>
									<Skeleton className='h-2 w-full rounded-full' />
								</div>
							</TableCell>

							{/* Notes */}
							<TableCell className='py-3'>
								<Skeleton className='h-4 w-40' />
							</TableCell>

							{/* Actions */}
							<TableCell className='py-3 text-right pr-4'>
								<div className='flex items-center gap-1.5 justify-end'>
									<Skeleton className='h-8 w-8 rounded-lg' />
									<Skeleton className='h-8 w-8 rounded-lg' />
								</div>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}