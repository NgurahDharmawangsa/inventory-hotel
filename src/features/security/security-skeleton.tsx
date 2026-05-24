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

export function SecurityTableSkeleton() {
	return (
		<div className='rounded-xl border border-border bg-card overflow-hidden shadow-xs'>
			<Table>
				<TableHeader className='bg-muted/30'>
					<TableRow className='hover:bg-transparent'>
						<TableHead className='font-bold pl-4'>
							<div className='flex items-center gap-1.5 py-2'>
								<span>Device Type</span>
							</div>
						</TableHead>
						<TableHead className='font-bold'>
							<div className='flex items-center gap-1.5 py-2'>
								<span>Location</span>
							</div>
						</TableHead>
						<TableHead className='font-bold'>
							<div className='flex items-center gap-1.5 py-2'>
								<span>Status</span>
							</div>
						</TableHead>
						<TableHead className='font-bold'>
							<div className='flex items-center gap-1.5 py-2'>
								<span>Vendor Partner</span>
							</div>
						</TableHead>
						<TableHead className='font-bold text-right pr-4'>Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{Array.from({ length: 8 }).map((_, i) => (
						<TableRow
							key={i}
							className='hover:bg-transparent border-b border-border/50'
						>
							{/* Device Type */}
							<TableCell className='pl-4 py-3'>
								<div className='flex flex-col gap-1'>
									<Skeleton className='h-4 w-32' />
									<Skeleton className='h-3 w-20' />
								</div>
							</TableCell>

							{/* Location */}
							<TableCell className='py-3'>
								<Skeleton className='h-4 w-24' />
							</TableCell>

							{/* Status */}
							<TableCell className='py-3'>
								<Skeleton className='h-5 w-20 rounded-full' />
							</TableCell>

							{/* Vendor Partner */}
							<TableCell className='py-3'>
								<Skeleton className='h-4 w-28' />
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