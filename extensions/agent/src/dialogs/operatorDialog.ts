/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

'use strict';

import * as sqlops from 'sqlops';
import * as vscode from 'vscode';
import { OperatorData } from '../data/operatorData';
import * as nls from 'vscode-nls';
import { AgentDialog } from './agentDialog';

const localize = nls.loadMessageBundle();

export class OperatorDialog extends AgentDialog<OperatorData> {

	// Top level
	private static readonly CreateDialogTitle: string = localize('createOperator.createOperator', 'Create Operator');
	private static readonly EditDialogTitle: string = localize('createOperator.editOperator', 'Edit Operator');
	private static readonly GeneralTabText: string = localize('createOperator.General', 'General');
	private static readonly NotificationsTabText: string = localize('createOperator.Notifications', 'Notifications');

	// General tab strings
	private static readonly NameLabel: string = localize('createOperator.Name', 'Name');
	private static readonly EnabledCheckboxLabel: string = localize('createOperator.Enabled', 'Enabled');
	private static readonly EmailNameTextLabel: string = localize('createOperator.EmailName', 'E-mail Name');
	private static readonly PagerEmailNameTextLabel: string = localize('createOperator.PagerEmailName', 'Pager E-mail Name');
	private static readonly PagerMondayCheckBoxLabel: string = localize('createOperator.PagerMondayCheckBox', 'Monday');
	private static readonly PagerTuesdayCheckBoxLabel: string = localize('createOperator.PagerTuesdayCheckBox', 'Tuesday');
	private static readonly PagerWednesdayCheckBoxLabel: string = localize('createOperator.PagerWednesdayCheckBox', 'Wednesday');
	private static readonly PagerThursdayCheckBoxLabel: string = localize('createOperator.PagerThursdayCheckBox', 'Thursday');
	private static readonly PagerFridayCheckBoxLabel: string = localize('createOperator.PagerFridayCheckBox', 'Friday  ');
	private static readonly PagerSaturdayCheckBoxLabel: string = localize('createOperator.PagerSaturdayCheckBox', 'Saturday');
	private static readonly PagerSundayCheckBoxLabel: string = localize('createOperator.PagerSundayCheckBox', 'Sunday');

	// Notifications tab strings
	private static readonly AlertsTableLabel: string = localize('createOperator.AlertListHeading', 'Alert list');
	private static readonly AlertNameColumnLabel: string = localize('createOperator.AlertNameColumnLabel', 'Alert name');
	private static readonly AlertEmailColumnLabel: string = localize('createOperator.AlertEmailColumnLabel', 'E-mail');
	private static readonly AlertPagerColumnLabel: string = localize('createOperator.AlertPagerColumnLabel', 'Pager');

	// UI Components
	private generalTab: sqlops.window.modelviewdialog.DialogTab;
	private notificationsTab: sqlops.window.modelviewdialog.DialogTab;

	// General tab controls
	private nameTextBox: sqlops.InputBoxComponent;
	private enabledCheckBox: sqlops.CheckBoxComponent;
	private emailNameTextBox: sqlops.InputBoxComponent;
	private pagerEmailNameTextBox: sqlops.InputBoxComponent;
	private pagerMondayCheckBox: sqlops.CheckBoxComponent;
	private pagerTuesdayCheckBox: sqlops.CheckBoxComponent;
	private pagerWednesdayCheckBox: sqlops.CheckBoxComponent;
	private pagerThursdayCheckBox: sqlops.CheckBoxComponent;
	private pagerFridayCheckBox: sqlops.CheckBoxComponent;
	private pagerSaturdayCheckBox: sqlops.CheckBoxComponent;
	private pagerSundayCheckBox: sqlops.CheckBoxComponent;
	private weekdayPagerStartTimeInput: sqlops.InputBoxComponent;
	private weekdayPagerEndTimeInput: sqlops.InputBoxComponent;
	private saturdayPagerStartTimeInput: sqlops.InputBoxComponent;
	private saturdayPagerEndTimeInput: sqlops.InputBoxComponent;
	private sundayPagerStartTimeInput: sqlops.InputBoxComponent;
	private sundayPagerEndTimeInput: sqlops.InputBoxComponent;

	// Notification tab controls
	private alertsTable: sqlops.TableComponent;

	constructor(ownerUri: string, operatorInfo: sqlops.AgentOperatorInfo = undefined) {
		super(
			ownerUri,
			new OperatorData(ownerUri, operatorInfo),
			operatorInfo ? OperatorDialog.EditDialogTitle : OperatorDialog.CreateDialogTitle);
	}

	protected async initializeDialog(dialog: sqlops.window.modelviewdialog.Dialog) {
		this.generalTab = sqlops.window.modelviewdialog.createTab(OperatorDialog.GeneralTabText);
		this.notificationsTab = sqlops.window.modelviewdialog.createTab(OperatorDialog.NotificationsTabText);

		this.initializeGeneralTab();
		this.initializeNotificationTab();

		this.dialog.content = [this.generalTab, this.notificationsTab];
	}

	private initializeGeneralTab() {
		this.generalTab.registerContent(async view => {

			this.nameTextBox = view.modelBuilder.inputBox().component();

			this.enabledCheckBox = view.modelBuilder.checkBox()
				.withProperties({
					label: OperatorDialog.EnabledCheckboxLabel
				}).component();
			this.enabledCheckBox.checked = true;
			this.emailNameTextBox = view.modelBuilder.inputBox().component();

			this.pagerEmailNameTextBox = view.modelBuilder.inputBox().component();

			this.enabledCheckBox = view.modelBuilder.checkBox()
				.withProperties({
					label: OperatorDialog.EnabledCheckboxLabel
				}).component();

			this.pagerMondayCheckBox = view.modelBuilder.checkBox()
				.withProperties({
					label: OperatorDialog.PagerMondayCheckBoxLabel
				}).component();

			this.pagerMondayCheckBox.onChanged(() => {
				if (this.pagerMondayCheckBox.checked) {
					this.weekdayPagerStartTimeInput.enabled = true;
					this.weekdayPagerEndTimeInput.enabled = true;
				} else {
					if (!this.pagerTuesdayCheckBox.checked && !this.pagerWednesdayCheckBox.checked &&
						!this.pagerThursdayCheckBox.checked && !this.pagerFridayCheckBox.checked) {
						this.weekdayPagerStartTimeInput.enabled = false;
						this.weekdayPagerEndTimeInput.enabled = false;
					}
				}
			});

			this.pagerTuesdayCheckBox = view.modelBuilder.checkBox()
				.withProperties({
					label: OperatorDialog.PagerTuesdayCheckBoxLabel
				}).component();


			this.pagerTuesdayCheckBox.onChanged(() => {
				if (this.pagerTuesdayCheckBox .checked) {
					this.weekdayPagerStartTimeInput.enabled = true;
					this.weekdayPagerEndTimeInput.enabled = true;
				} else {
					if (!this.pagerMondayCheckBox.checked && !this.pagerWednesdayCheckBox.checked &&
						!this.pagerThursdayCheckBox.checked && !this.pagerFridayCheckBox.checked) {
						this.weekdayPagerStartTimeInput.enabled = false;
						this.weekdayPagerEndTimeInput.enabled = false;
					}
				}
			});

			this.pagerWednesdayCheckBox = view.modelBuilder.checkBox()
				.withProperties({
					label: OperatorDialog.PagerWednesdayCheckBoxLabel
				}).component();

			this.pagerWednesdayCheckBox.onChanged(() => {
				if (this.pagerWednesdayCheckBox .checked) {
					this.weekdayPagerStartTimeInput.enabled = true;
					this.weekdayPagerEndTimeInput.enabled = true;
				} else {
					if (!this.pagerMondayCheckBox.checked && !this.pagerTuesdayCheckBox.checked &&
						!this.pagerThursdayCheckBox.checked && !this.pagerFridayCheckBox.checked) {
						this.weekdayPagerStartTimeInput.enabled = false;
						this.weekdayPagerEndTimeInput.enabled = false;
					}
				}
			});

			this.pagerThursdayCheckBox = view.modelBuilder.checkBox()
				.withProperties({
					label: OperatorDialog.PagerThursdayCheckBoxLabel
				}).component();

			this.pagerThursdayCheckBox.onChanged(() => {
				if (this.pagerThursdayCheckBox .checked) {
					this.weekdayPagerStartTimeInput.enabled = true;
					this.weekdayPagerEndTimeInput.enabled = true;
				} else {
					if (!this.pagerMondayCheckBox.checked && !this.pagerWednesdayCheckBox.checked &&
						!this.pagerTuesdayCheckBox.checked && !this.pagerFridayCheckBox.checked) {
						this.weekdayPagerStartTimeInput.enabled = false;
						this.weekdayPagerEndTimeInput.enabled = false;
					}
				}
			});

			this.weekdayPagerStartTimeInput = view.modelBuilder.inputBox()
				.withProperties({
					inputType: 'time',
					placeHolder: '08:00:00'
				}).component();
			this.weekdayPagerStartTimeInput.enabled = false;
			let weekdayStartInputContainer = view.modelBuilder.formContainer()
				.withFormItems([{
					component: this.weekdayPagerStartTimeInput,
					title: 'Workday begin'
				}]).component();

			this.weekdayPagerEndTimeInput = view.modelBuilder.inputBox()
				.withProperties({
					inputType: 'time',
					placeHolder: '06:00:00'
				}).component();
			this.weekdayPagerEndTimeInput.enabled = false;
			let weekdayEndInputContainer = view.modelBuilder.formContainer()
				.withFormItems([{
					component: this.weekdayPagerEndTimeInput,
					title: 'Workday end'
				}]).component();

			this.pagerFridayCheckBox = view.modelBuilder.checkBox()
				.withProperties({
					label: OperatorDialog.PagerFridayCheckBoxLabel,
					width: 80
				}).component();
			this.pagerFridayCheckBox.onChanged(() => {
				if (this.pagerFridayCheckBox.checked) {
					this.weekdayPagerStartTimeInput.enabled = true;
					this.weekdayPagerEndTimeInput.enabled = true;
				} else {
					if (!this.pagerMondayCheckBox.checked && !this.pagerWednesdayCheckBox.checked &&
						!this.pagerThursdayCheckBox.checked && !this.pagerTuesdayCheckBox.checked) {
						this.weekdayPagerStartTimeInput.enabled = false;
						this.weekdayPagerEndTimeInput.enabled = false;
					}
				}
			});

			let pagerFridayCheckboxContainer = view.modelBuilder.flexContainer()
				.withLayout({
					flexFlow: 'row',
					alignItems: 'baseline'
				}).withItems([this.pagerFridayCheckBox, weekdayStartInputContainer, weekdayEndInputContainer])
				.component();

			this.pagerSaturdayCheckBox = view.modelBuilder.checkBox()
				.withProperties({
					label: OperatorDialog.PagerSaturdayCheckBoxLabel,
					width: 80
				}).component();

			this.pagerSaturdayCheckBox.onChanged(() => {
				if (this.pagerSaturdayCheckBox.checked) {
					this.saturdayPagerStartTimeInput.enabled = true;
					this.saturdayPagerEndTimeInput.enabled = true;
				} else {
					this.saturdayPagerStartTimeInput.enabled = false;
					this.saturdayPagerEndTimeInput.enabled = false;
				}
			});

			this.saturdayPagerStartTimeInput = view.modelBuilder.inputBox()
				.withProperties({
					inputType: 'time',
					placeHolder: '08:00:00'
				}).component();
			this.saturdayPagerStartTimeInput.enabled = false;
			let saturdayStartInputContainer = view.modelBuilder.formContainer()
				.withFormItems([{
					component: this.saturdayPagerStartTimeInput,
					title: 'Workday begin'
				}]).component();

			this.saturdayPagerEndTimeInput = view.modelBuilder.inputBox()
				.withProperties({
					inputType: 'time',
					placeHolder: '06:00:00'
				}).component();
			this.saturdayPagerEndTimeInput.enabled = false;
			let saturdayEndInputContainer = view.modelBuilder.formContainer()
				.withFormItems([{
					component: this.saturdayPagerEndTimeInput,
					title: 'Workday end'
				}]).component();

			let pagerSaturdayCheckboxContainer = view.modelBuilder.flexContainer()
				.withLayout({
					flexFlow: 'row',
					alignItems: 'baseline'
				}).withItems([this.pagerSaturdayCheckBox, saturdayStartInputContainer, saturdayEndInputContainer])
				.component();

			this.pagerSundayCheckBox = view.modelBuilder.checkBox()
				.withProperties({
					label: OperatorDialog.PagerSundayCheckBoxLabel,
					width: 80
				}).component();

			this.pagerSundayCheckBox.onChanged(() => {
				if (this.pagerSundayCheckBox.checked) {
					this.sundayPagerStartTimeInput.enabled = true;
					this.sundayPagerEndTimeInput.enabled = true;
				} else {
					this.sundayPagerStartTimeInput.enabled = false;
					this.sundayPagerEndTimeInput.enabled = false;
				}
			});

			this.sundayPagerStartTimeInput = view.modelBuilder.inputBox()
				.withProperties({
					inputType: 'time',
					placeHolder: '08:00:00'
				}).component();
			this.sundayPagerStartTimeInput.enabled = false;
			let sundayStartInputContainer = view.modelBuilder.formContainer()
				.withFormItems([{
					component: this.sundayPagerStartTimeInput,
					title: 'Workday begin'
				}]).component();

			this.sundayPagerEndTimeInput = view.modelBuilder.inputBox()
				.withProperties({
					inputType: 'time',
					placeHolder: '06:00:00'
				}).component();
			this.sundayPagerEndTimeInput.enabled = false;
			let sundayEndInputContainer = view.modelBuilder.formContainer()
				.withFormItems([{
					component: this.sundayPagerEndTimeInput,
					title: 'Workday end'
				}]).component();

			let pagerSundayCheckboxContainer = view.modelBuilder.flexContainer()
				.withLayout({
					flexFlow: 'row',
					alignItems: 'baseline'
				}).withItems([this.pagerSundayCheckBox, sundayStartInputContainer, sundayEndInputContainer])
				.component();

			let checkBoxContainer = view.modelBuilder.formContainer()
				.withFormItems([{
					component: this.pagerMondayCheckBox,
					title: ''
				}, {
					component: this.pagerTuesdayCheckBox,
					title: ''
				}, {
					component: this.pagerWednesdayCheckBox,
					title: ''
				}, {
					component: this.pagerThursdayCheckBox,
					title: ''
				}, {
					component: pagerFridayCheckboxContainer,
					title: ''
				}, {
					component: pagerSaturdayCheckboxContainer,
					title: ''
				}, {
					component: pagerSundayCheckboxContainer,
					title: ''
				}]).component();

			let pagerContainer = view.modelBuilder.flexContainer()
				.withLayout({
					flexFlow: 'row'
				}).withItems([checkBoxContainer])
				.component();

			let formModel = view.modelBuilder.formContainer()
				.withFormItems([{
					component: this.nameTextBox,
					title: OperatorDialog.NameLabel
				}, {
					component: this.enabledCheckBox,
					title: ''
				}, {
					component: this.emailNameTextBox,
					title: OperatorDialog.EmailNameTextLabel
				}, {
					component: this.pagerEmailNameTextBox,
					title: OperatorDialog.PagerEmailNameTextLabel
				}, {
					component: pagerContainer,
					title: ''
				}]).withLayout({ width: '100%' }).component();

			await view.initializeModel(formModel);
		});
	}

	private initializeNotificationTab() {
		this.notificationsTab.registerContent(async view => {

			this.alertsTable = view.modelBuilder.table()
				.withProperties({
					columns: [
						OperatorDialog.AlertNameColumnLabel,
						OperatorDialog.AlertEmailColumnLabel,
						OperatorDialog.AlertPagerColumnLabel
					],
					data: [],
					height: 500
				}).component();

			let formModel = view.modelBuilder.formContainer()
				.withFormItems([{
					component: this.alertsTable,
					title: OperatorDialog.AlertsTableLabel
				}]).withLayout({ width: '100%' }).component();

			await view.initializeModel(formModel);
		});
	}

	protected updateModel() {
		this.model.name = this.nameTextBox.value;
		this.model.enabled = this.enabledCheckBox.checked;
		this.model.emailAddress = this.emailNameTextBox.value;
		this.model.pagerAddress = this.pagerEmailNameTextBox.value;
		this.model.weekdayPagerStartTime = this.weekdayPagerStartTimeInput.value;
		this.model.weekdayPagerEndTime = this.weekdayPagerEndTimeInput.value;
		this.model.saturdayPagerStartTime = this.saturdayPagerStartTimeInput.value;
		this.model.saturdayPagerEndTime = this.saturdayPagerEndTimeInput.value;
		this.model.sundayPagerStartTime = this.sundayPagerStartTimeInput.value;
		this.model.sundayPagerEndTime = this.sundayPagerEndTimeInput.value;
	}
}
