{{- define "re-cms-stack.fullname" -}}
{{- printf "%s-re-cms" .Release.Name | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{- define "re-cms-stack.serviceAccountName" -}}
{{- printf "%s-sa" (include "re-cms-stack.fullname" .) -}}
{{- end -}}
